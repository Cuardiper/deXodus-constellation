// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ILiquidityPool} from "./interfaces/ILiquidityPool.sol";
import {IPriceFeed} from "./interfaces/IPriceFeed.sol";


contract Futures is UUPSUpgradeable, Ownable2StepUpgradeable {
    using SafeERC20 for IERC20;

    error Futures__FutureAlreadyExists();
    error Futures__FutureDoesNotExists();

    ILiquidityPool public liquidityPool;

    IERC20 public USDC;
    uint256 public positionIdCounter;
    IPriceFeed public priceFeed;
    address public wbtc;
    address public weth;

    struct Position {
        uint256 positionId;
        uint256 startedAt;
        uint256 size;
        uint256 collateral;
        uint256 entryPrice;
        uint256 liqPrice;
        bool long;
        uint256 marketId;
    }

    struct FutureInfo {
        string market;
    }

    uint256 public counter;
    mapping(uint256 => FutureInfo) public futureMarket;
    mapping(string => uint256) public futureId;

    mapping(uint256 => mapping(address => Position)) public longPositions;
    mapping(uint256 => mapping(address => Position)) public shortPositions;

    uint256 private usdcOut;
    uint256 private fromLiquidityPool;
    uint256 private fromCollateral;
    uint256 private newLeverage;
    uint256 private leverage;
    uint256 private leverageToReturn;
    uint256 private currentSize;

    uint256 public constant BASIS_POINTS = 10000;
    uint256 public liquidationThreshold;

    event OpenPosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event IncreasePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event DecreasePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event ClosePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event LiquidatePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _liquidityPool,
        address _priceFeed,
        address _usdc,
        address _weth,
        address _wbtc,
        uint256 _liquidationThreshold
    ) external initializer {
        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        _transferOwnership(msg.sender);

        weth = _weth;
        wbtc = _wbtc;
        liquidityPool = ILiquidityPool(_liquidityPool);
        priceFeed = IPriceFeed(_priceFeed);
        USDC = IERC20(_usdc);
        liquidationThreshold = _liquidationThreshold;
    }

    /*###############################################################################################################################
    #######################################################                    ######################################################
    ######################################################    CORE FUNCTIONS    #####################################################
    #######################################################                    ######################################################
    ###############################################################################################################################*/

    function createFuture(
        string memory _market
    ) external onlyOwner {
        if (futureId[_market] != 0) {
            revert Futures__FutureAlreadyExists();
        }
        ++counter;
        futureMarket[counter] = FutureInfo({market: _market});
        futureId[_market] = counter;
    }

    function calcLiquidationPrice(
        Position memory _position
    ) public view returns (uint256 liqPrice) {
        uint256 leverage = _position.size - _position.collateral;
        uint256 tokenAmount = ((_position.size * 1e12) / _position.entryPrice) /
            1e6;
        liqPrice = ((((leverage * 1e12) / tokenAmount) * liquidationThreshold) / BASIS_POINTS) / 1e6;
    }

    function increasePosition(
        uint256 _futureId,
        uint256 _size,
        uint256 _collateral,
        uint256 _currentPrice,
        bool _long
    ) external {
        if (!validFuture(_futureId)) revert Futures__FutureDoesNotExists();
        require(priceFeed.isAcceptablePrice(_futureId, _currentPrice));

        USDC.safeTransferFrom(msg.sender, address(this), _collateral);
        liquidityPool.blockLiquidity(_collateral * 9);

        if (_long) {
            Position memory position = longPositions[_futureId][msg.sender];
            if (position.size == 0) {
                position.startedAt = block.timestamp;
                position.size = _size;
                position.collateral = _collateral;
                position.entryPrice = _currentPrice;
                position.liqPrice = calcLiquidationPrice(position);
                position.long = _long;
                position.marketId = _futureId;
                position.positionId = positionIdCounter;
                positionIdCounter++;
                emit OpenPosition(position.marketId, position.positionId, msg.sender, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
            } else {
                require(position.long);
                position.entryPrice =
                    ((position.entryPrice * position.size) +
                        (_currentPrice * _size)) /
                    (position.size + _size);
                position.startedAt =
                    ((position.startedAt * position.size) +
                        (block.timestamp * _size)) /
                    (position.size + _size);
                position.collateral += _collateral;
                position.size = position.size + _size;
                position.liqPrice = calcLiquidationPrice(position);
                require(_currentPrice > position.liqPrice);
                emit IncreasePosition(position.marketId, position.positionId, msg.sender, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
            }
            require(position.size / position.collateral <= 50);
            longPositions[_futureId][msg.sender] = position;
        } else {
            revert();
        }
    }

    function decreasePosition(
        uint256 _futureId,
        uint256 _percentageDecrease, // percentage with 2 decimals (0-10000);
        uint256 _currentPrice,
        bool _keepLeverageRatio,
        bool _long
    ) external {
        if (!validFuture(_futureId)) revert Futures__FutureDoesNotExists();
        require(priceFeed.isAcceptablePrice(_futureId, _currentPrice));

        _keepLeverageRatio = true; // will be used in the future for users to decide (now always true)

        if (_long) {
            Position memory position = longPositions[_futureId][msg.sender];
            require(position.long);
            require(position.size != 0);
            
            if (_keepLeverageRatio) {
                // convert current size to function public with address and long bool or the position
                currentSize = (_currentPrice * position.size) /
                    position.entryPrice;
                leverage = position.size - position.collateral;
                leverageToReturn = (leverage * _percentageDecrease) /
                    (100 * 100); // /100
                if (leverageToReturn < leverage) {
                    position.size -= leverageToReturn;
                    usdcOut =
                        (currentSize * _percentageDecrease) /
                        10000 -
                        leverageToReturn;
                    uint256 collateralToDecrease = (position.collateral *
                        _percentageDecrease) / 10000;
                    position.collateral -= collateralToDecrease;
                    position.size -= collateralToDecrease;
                    if (usdcOut > collateralToDecrease) {
                        fromLiquidityPool = usdcOut - collateralToDecrease;
                    } else {
                        fromLiquidityPool = 0;
                    }
                    fromCollateral = collateralToDecrease;
                    newLeverage = position.size - position.collateral;
                    uint256 tokenAmount = ((position.size * 1e12) /
                        position.entryPrice) / 1e6;
                    position.liqPrice =
                        ((((newLeverage * 1e12) / tokenAmount) * 10005) /
                            10000) /
                        1e6;
                    emit DecreasePosition(position.marketId, position.positionId, msg.sender, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
                    require(_currentPrice > position.liqPrice);
                    longPositions[_futureId][msg.sender] = position;
                    if (collateralToDecrease < usdcOut) {
                        USDC.safeTransfer(msg.sender, collateralToDecrease);
                    } else {
                        USDC.safeTransfer(msg.sender, usdcOut);
                    }
                    liquidityPool.benefitsToTrader(
                        msg.sender,
                        fromLiquidityPool
                    );
                    liquidityPool.unblockLiquidity(collateralToDecrease * 9 - fromLiquidityPool);
                    //emit DecreasePosition(position.marketId, position.positionId, msg.sender, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
                } else {
                    usdcOut =
                        (currentSize * _percentageDecrease) /
                        10000 -
                        leverage;
                    if (usdcOut > position.collateral){
                        fromLiquidityPool = usdcOut - position.collateral;
                        fromCollateral = position.collateral;
                        liquidityPool.unblockLiquidity(position.collateral * 9 - fromLiquidityPool);
                        delete longPositions[_futureId][msg.sender];
                        liquidityPool.benefitsToTrader(
                            msg.sender,
                            fromLiquidityPool
                        );
                        USDC.safeTransfer(msg.sender, fromCollateral);
                    } else {
                        fromCollateral = usdcOut;
                        liquidityPool.unblockLiquidity(position.collateral * 9);
                        delete longPositions[_futureId][msg.sender];
                        USDC.safeTransfer(msg.sender, fromCollateral);
                    }
                    emit ClosePosition(position.marketId, position.positionId, msg.sender, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
                }
            } else {
                revert(); // modify ratio not yet available
            }
        } else {    
            revert(); // shorts not yet available
        }
    }
 
    // function to liquidate positions
    function liquidatePosition(
        uint256 _futureId,
        address _trader,
        bool _long
    ) external {
        uint256 rest;
        // Improve efficiency for calls to priceFeed
        if (_long) {
            Position memory position = longPositions[_futureId][_trader];
            require(position.long);
            require(position.size != 0);
            uint256 currentPrice;
            if (position.marketId == 1) {
                currentPrice = priceFeed.mockGetUsdPriceFromChainlink(wbtc);
            } else {
                currentPrice = priceFeed.mockGetUsdPriceFromChainlink(weth);
            }
            if (IsPositionLiquidable(position, currentPrice)) {
                currentSize = (currentPrice * position.size) / position.entryPrice;
                leverage = position.size - position.collateral;
                if (currentSize > leverage) usdcOut = currentSize - leverage;
                else usdcOut = 0;
                fromCollateral = usdcOut;
                liquidityPool.unblockLiquidity(position.collateral * 9);
                delete longPositions[_futureId][_trader];
                USDC.safeTransfer(_trader, fromCollateral);
                USDC.safeTransfer(address(liquidityPool), position.collateral - fromCollateral);
                emit LiquidatePosition(position.marketId, position.positionId, _trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, currentPrice);
            } else {
                revert();
            }
        } else {
            revert(); // shorts not yet available
        }
    }

    /*###############################################################################################################################
    #######################################################                    ######################################################
    ######################################################       HELPERS        #####################################################
    #######################################################                    ######################################################
    ###############################################################################################################################*/

    function IsPositionLiquidable(
        Position memory _position, uint256 _currentPrice
    ) public view returns (bool) {
        if (_position.long) {
            return (_position.liqPrice > _currentPrice);
            // return (_position.liqPrice > priceFeed.getUsdPriceFromChainlink());
        } else {
            revert();   // shorts not yet available
            // return (_position.liqPrice > priceFeed.getPrice(_position.marketId));
        }
    }

    function positionNetValue (uint256 _price, address _trader, bool _long, uint256 _futureId) public view returns (uint256 positionNetValue){
        if (_long) {
            Position memory position = longPositions[_futureId][_trader];
            if (position.collateral == 0) {
                return (positionNetValue);
            }
            uint256 newSize = (_price * position.size) / position.entryPrice;
            uint256 leverage = (position.size - position.collateral);
            if (newSize > leverage) {
                positionNetValue = newSize - leverage;
            }
            return positionNetValue;
        } else {
            revert(); // shorts not yet available
        }
    }

    /*###############################################################################################################################
    #######################################################                     #####################################################
    ######################################################    OTHER FUNCTIONS    ####################################################
    #######################################################                     #####################################################
    ###############################################################################################################################*/

    function validFuture(uint256 _futureId) public view returns (bool) {
        return (_futureId != 0 && _futureId <= counter);
    }

    function getTraderPosition(
        uint256 _futureId,
        address _user,
        bool _long
    )
        public
        view
        returns (
            uint256 startedAt,
            uint256 size,
            uint256 collateral,
            uint256 entryPrice,
            uint256 liqPrice,
            bool long,
            uint256 marketId
        )
    {
        Position memory position;
        if (_long) {
            position = longPositions[_futureId][_user];
        } else {
            position = shortPositions[_futureId][_user];
        }
        return (
            position.startedAt,
            position.size,
            position.collateral,
            position.entryPrice,
            position.liqPrice,
            position.long,
            position.marketId
        );
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override onlyOwner {}

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}