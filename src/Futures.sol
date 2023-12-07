// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ILiquidityPool} from "./interfaces/ILiquidityPool.sol";
import {IPriceFeed} from "./interfaces/IPriceFeed.sol";
//import {console} from "../lib/hardhat/packages/hardhat-core/console.sol";

import {MockToken} from "./mocks/MockUSDC.sol";

//////////////////////////////////
////////////////////////INTERFACES
//////////////////////////////////

interface StreamsLookupCompatibleInterface {
    error StreamsLookup(
        string feedParamKey,
        string[] feeds,
        string timeParamKey,
        uint256 time,
        bytes extraData
    );

    /**
     * @notice any contract which wants to utilize FeedLookup feature needs to
     * implement this interface as well as the automation compatible interface.
     * @param values an array of bytes returned from Mercury endpoint.
     * @param extraData context data from feed lookup process.
     * @return upkeepNeeded boolean to indicate whether the keeper should call performUpkeep or not.
     * @return performData bytes that the keeper should call performUpkeep with, if
     * upkeep is needed. If you would like to encode data to decode later, try `abi.encode`.
     */
    function checkCallback(bytes[] memory values, bytes memory extraData)
        external
        view
        returns (bool upkeepNeeded, bytes memory performData);
}

struct Log {
    uint256 index;
    uint256 timestamp;
    bytes32 txHash;
    uint256 blockNumber;
    bytes32 blockHash;
    address source;
    bytes32[] topics;
    bytes data;
}

interface ILogAutomation {
    /**
     * @notice method that is simulated by the keepers to see if any work actually
     * needs to be performed. This method does does not actually need to be
     * executable, and since it is only ever simulated it can consume lots of gas.
     * @dev To ensure that it is never called, you may want to add the
     * cannotExecute modifier from KeeperBase to your implementation of this
     * method.
     * @param log the raw log data matching the filter that this contract has
     * registered as a trigger
     * @param checkData user-specified extra data to provide context to this upkeep
     * @return upkeepNeeded boolean to indicate whether the keeper should call
     * performUpkeep or not.
     * @return performData bytes that the keeper should call performUpkeep with, if
     * upkeep is needed. If you would like to encode data to decode later, try
     * `abi.encode`.
     */
    function checkLog(Log calldata log, bytes memory checkData)
        external
        returns (bool upkeepNeeded, bytes memory performData);

    /**
     * @notice method that is actually executed by the keepers, via the registry.
     * The data returned by the checkUpkeep simulation will be passed into
     * this method to actually be executed.
     * @dev The input to this method should not be trusted, and the caller of the
     * method should not even be restricted to any single registry. Anyone should
     * be able call it, and the input should be validated, there is no guarantee
     * that the data passed in is the performData returned from checkUpkeep. This
     * could happen due to malicious keepers, racing keepers, or simply a state
     * change while the performUpkeep transaction is waiting for confirmation.
     * Always validate the data passed in.
     * @param performData is the data which was passed back from the checkData
     * simulation. If it is encoded, it can easily be decoded into other types by
     * calling `abi.decode`. This data should not be trusted, and should be
     * validated against the contract's current state.
     */
    function performUpkeep(bytes calldata performData) external;
}

interface IFeeManager {
    function getFeeAndReward(
        address subscriber,
        bytes memory report,
        address quoteAddress
    )
        external
        returns (
            ChainlinkCommon.Asset memory,
            ChainlinkCommon.Asset memory,
            uint256
        );

    function i_linkAddress() external view returns (address);

    function i_nativeAddress() external view returns (address);

    function i_rewardManager() external view returns (address);
}

library ChainlinkCommon {
    // @notice The asset struct to hold the address of an asset and amount
    struct Asset {
        address assetAddress;
        uint256 amount;
    }

    // @notice Struct to hold the address and its associated weight
    struct AddressAndWeight {
        address addr;
        uint64 weight;
    }
}

interface IVerifierProxy {
    function verify(bytes calldata payload, bytes calldata parameterPayload)
        external
        payable
        returns (bytes memory verifierResponse);

    function s_feeManager() external view returns (IVerifierFeeManager);
}

interface IReportHandler {
    function handleReport(bytes calldata report) external;
}

interface IVerifierFeeManager {}

interface IRewardManager {}

//////////////////////////////////
///////////////////END INTERFACES
//////////////////////////////////

contract Futures is
    // UUPSUpgradeable,
    // Ownable2StepUpgradeable,
    // PausableUpgradeable,
    ILogAutomation,
    StreamsLookupCompatibleInterface
{
    using SafeERC20 for IERC20;

    // ------------ start of new section for data streams

    struct BasicReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified on-chain
        int192 price; // DON consensus median price, carried to 8 decimal places
    }

    struct PremiumReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified on-chain
        int192 price; // DON consensus median price, carried to 8 decimal places
        int192 bid; // Simulated price impact of a buy order up to the X% depth of liquidity utilisation
        int192 ask; // Simulated price impact of a sell order up to the X% depth of liquidity utilisation
    }

    struct Quote {
        address quoteAddress;
    }

    event PriceUpdate(address indexed trader, uint256 price);

    IVerifierProxy public verifier;

    address public FEE_ADDRESS;
    string public constant STRING_DATASTREAMS_FEEDLABEL = "feedIDs";
    string public constant STRING_DATASTREAMS_QUERYLABEL = "timestamp";
    string[] public feedIds = [
        "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b" // Ex. Basic ETH/USD price report
    ];

    // constructor(
    //     // address _verifier
    // ) {
    //     verifier = IVerifierProxy(_verifier); //Arbitrum Sepolia: 0x2ff010debc1297f19579b4246cad07bd24f2488a
    // }

    constructor(
        address _liquidityPool,
        address _priceFeed,
        address _usdc,
        address _weth,
        address _wbtc,
        uint256 _liquidationThreshold
    ) {

        weth = _weth;
        wbtc = _wbtc;
        liquidityPool = ILiquidityPool(_liquidityPool);
        priceFeed = IPriceFeed(_priceFeed);
        USDC = IERC20(_usdc);
        liquidationThreshold = _liquidationThreshold;
        governance = msg.sender;

        verifier = IVerifierProxy(0x2ff010DEbC1297f19579B4246cad07bd24F2488A);
    }

    function checkLog(Log calldata log, bytes memory)
        external
        returns (bool upkeepNeeded, bytes memory performData)
    {
        revert StreamsLookup(
            STRING_DATASTREAMS_FEEDLABEL,
            feedIds,
            STRING_DATASTREAMS_QUERYLABEL,
            log.timestamp,
            log.data
        );
    }

    function checkCallback(bytes[] calldata values, bytes calldata extraData)
        external
        pure
        returns (bool, bytes memory)
    {
        return (true, abi.encode(values, extraData));
    }

    // function will be performed on-chain
    function performUpkeep(bytes calldata performData) external {
        // Decode incoming performData
        (bytes[] memory signedReports, bytes memory extraData) = abi.decode(
            performData,
            (bytes[], bytes)
        );

        (
            address trader,
            uint256 _futureId,
            uint256 size,
            uint256 collateral,
            bool long,
            uint256 txType,
            string memory feedId
        ) = abi.decode(extraData, (address, uint256, uint256, uint256, bool, uint256, string));

        bytes memory report = signedReports[0];

        (, bytes memory reportData) = abi.decode(report, (bytes32[3], bytes));

        // Billing

        IFeeManager feeManager = IFeeManager(address(verifier.s_feeManager()));
        IRewardManager rewardManager = IRewardManager(
            address(feeManager.i_rewardManager())
        );

        address feeTokenAddress = feeManager.i_linkAddress();
        (ChainlinkCommon.Asset memory fee, , ) = feeManager.getFeeAndReward(
            address(this),
            reportData,
            feeTokenAddress
        );

        IERC20(feeTokenAddress).approve(address(rewardManager), fee.amount);

        // Verify the report
        bytes memory verifiedReportData = verifier.verify(report, abi.encode(feeTokenAddress));

        /*
        Deprecated Interface:
        bytes memory verifiedReportData = verifier.verify(bundledReport);
        */

        // Decode verified report data into BasicReport struct
        BasicReport memory verifiedReport = abi.decode(
            verifiedReportData,
            (BasicReport)
        );

        uint256 _currentPrice = _scalePriceToTokenDecimals(
            USDC,
            verifiedReport.price
        );

        uint256 _percentageDecrease = size;

        if (txType == 1) { 
            _increasePosition(trader, _futureId, size, collateral, _currentPrice, long); 
        } else if (txType == 2) {
            _increaseCollateral(trader, _futureId, collateral, _currentPrice, long);
        } else if (txType == 3) {
            _decreasePosition(trader, _futureId, _percentageDecrease, _currentPrice, true, long);
        } else if (txType == 4) {
            _decreaseCollateral(trader, _futureId, _percentageDecrease, _currentPrice, long);
        } 
        
        // Log price from report
        emit PriceUpdate(trader, _currentPrice);
    }

    /**
     * @dev Scales the price from a report to match the token's decimals.
     * @param tokenOut The output token for which the price should be scaled.
     * @param priceFromReport The price from the report to be scaled.
     * @return The scaled price with the appropriate token decimals.
     */
    function _scalePriceToTokenDecimals(
        IERC20 tokenOut,
        int192 priceFromReport
    ) private view returns (uint256) {
        uint256 pricefeedDecimals = 18;
        uint8 tokenOutDecimals = MockToken(address(tokenOut)).decimals();
        if (tokenOutDecimals < pricefeedDecimals) {
            uint256 difference = pricefeedDecimals - tokenOutDecimals;
            return uint256(uint192(priceFromReport)) / 10 ** difference;
        } else {
            uint256 difference = tokenOutDecimals - pricefeedDecimals;
            return uint256(uint192(priceFromReport)) * 10 ** difference;
        }
    }

    fallback() external payable {}

    // ------------ end of new section for data streams

    event InitiateTrade(
        address msgSender,
        uint256 futureId,
        uint256 size,
        uint256 collateral,
        bool long,
        uint256 txType,
        string feedId
    );

    function increasePosition(
        uint256 _futureId,
        uint256 _size,
        uint256 _collateral,
        bool _long,
        string memory feedId
    ) external {
        emit InitiateTrade(msg.sender, _futureId, _size, _collateral, _long, 1, feedId);
    }

    function increaseCollateral(
        uint256 _futureId,
        uint256 _collateral,
        bool _long,
        string memory feedId
    ) external {
        emit InitiateTrade(msg.sender, _futureId, 0, _collateral, _long, 2, feedId);
    }

    function decreasePosition(
        uint256 _futureId,
        uint256 _percentageDecrease, // percentage with 2 decimals (0-10000);
        bool _long,
        string memory feedId
    ) external {
        emit InitiateTrade(msg.sender, _futureId, _percentageDecrease, 0, _long, 3, feedId);
    }

    function decreaseCollateral(
        uint256 _futureId,
        uint256 _percentageDecrease,
        bool _long,
        string memory feedId
    ) external {
        emit InitiateTrade(msg.sender, _futureId, _percentageDecrease, 0, _long, 4, feedId);
    }

    error Futures__FutureAlreadyExists();
    error Futures__FutureDoesNotExists();

    ILiquidityPool public liquidityPool;
    IPriceFeed public priceFeed;
    address public governance;
    IERC20 public USDC;
    address public wbtc;
    address public weth;
    uint256 public positionIdCounter;

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
        //address underlyingAsset; change all the logic adding underlying asset to the deployment of the contract and the logic for priceFeed
    }

    uint256 private usdcOut;
    uint256 private fromLiquidityPool;
    uint256 private fromCollateral;
    uint256 private newLeverage;
    uint256 private leverage;
    uint256 private leverageToReturn;
    uint256 private currentSize;

    uint256 public counter;
    mapping(uint256 => FutureInfo) public futureMarket;
    mapping(string => uint256) public futureId;

    mapping(uint256 => mapping(address => Position)) public longPositions; // rethink how to manage this to have one long and one short
    mapping(uint256 => mapping(address => Position)) public shortPositions;

    uint256 public makerTradingFee;
    uint256 public takerTradingFee;
    uint256 public priceImpactFee;
    uint256 public fundingFee;
    uint256 public borrowingFee;
    uint256 public executionFee;
    uint256 public constant PERCENTAGE = 10000;
    uint256 public liquidationThreshold;

    event CreateFuture(uint256 indexed futureId, string market);
    event UpdatedGovernance(address oldGovernance, address newGovernance);

    event OpenPosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event IncreasePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event DecreasePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event IncreaseCollateral(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event DecreaseCollateral(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event ClosePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);
    event LiquidatePosition(uint256 indexed marketId, uint256 indexed positionId, address indexed trader, uint256 startedAt, uint256 size, uint256 collateral, uint256 entryPrice, uint256 liqPrice, bool long, uint256 currentPrice);

    modifier onlyGov() {
        require(msg.sender == governance);
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    // constructor() {
    //     _disableInitializers();
    // }

    // function initialize(
    //     address _liquidityPool,
    //     address _priceFeed,
    //     address _usdc,
    //     address _weth,
    //     address _wbtc,
    //     uint256 _liquidationThreshold
    // ) external initializer {
    //     __UUPSUpgradeable_init();
    //     __Ownable2Step_init();
    //     __Pausable_init();
    //     _transferOwnership(msg.sender);

    //     weth = _weth;
    //     wbtc = _wbtc;
    //     liquidityPool = ILiquidityPool(_liquidityPool);
    //     priceFeed = IPriceFeed(_priceFeed);
    //     USDC = IERC20(_usdc);
    //     liquidationThreshold = _liquidationThreshold;
    //     governance = msg.sender;
    // }

    /*###############################################################################################################################
    #######################################################                    ######################################################
    ######################################################    CORE FUNCTIONS    #####################################################
    #######################################################                    ######################################################
    ###############################################################################################################################*/

    function createFuture(
        string memory _market
    ) external {
        if (futureId[_market] != 0) {
            revert Futures__FutureAlreadyExists();
        }
        ++counter;
        futureMarket[counter] = FutureInfo({market: _market});
        futureId[_market] = counter;
        emit CreateFuture(counter, _market);
    }

    function calcLiquidationPrice(
        Position memory _position
    ) public view returns (uint256 liqPrice) {
        uint256 leverage = _position.size - _position.collateral;
        uint256 tokenAmount = ((_position.size * 1e12) / _position.entryPrice) /
            1e6;
        liqPrice = ((((leverage * 1e12) / tokenAmount) * 10005) / 10000) / 1e6;
    }

    function _increasePosition(
        address trader,
        uint256 _futureId,
        uint256 _size,
        uint256 _collateral,
        uint256 _currentPrice,
        bool _long
    ) internal  {
        if (!validFuture(_futureId)) revert Futures__FutureDoesNotExists();
        // require(priceFeed.isAcceptablePrice(_futureId, _currentPrice));

        USDC.safeTransferFrom(trader, address(this), _collateral);
        liquidityPool.blockLiquidity(_collateral * 9);

        if (_long) {
            Position memory position = longPositions[_futureId][trader];
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
                emit OpenPosition(position.marketId, position.positionId, trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
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
                emit IncreasePosition(position.marketId, position.positionId, trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
            }
            require(position.size / position.collateral <= 50);
            longPositions[_futureId][trader] = position;
        } else {
            revert();
        }
    }

    function _increaseCollateral(
        address trader,
        uint256 _futureId,
        uint256 _collateral,
        uint256 _currentPrice,
        bool _long
    ) internal  {
        if (!validFuture(_futureId)) revert Futures__FutureDoesNotExists();
        // require(priceFeed.isAcceptablePrice(_futureId, _currentPrice));

        USDC.safeTransferFrom(trader, address(this), _collateral);
        liquidityPool.blockLiquidity(_collateral * 9);

        if (_long) {
            Position memory position = longPositions[_futureId][trader];
            require(position.long);
            require(position.size != 0);
            position.entryPrice =
                ((position.entryPrice * position.size) +
                    (_currentPrice * _collateral)) /
                (position.size + _collateral);
            position.size += _collateral;
            position.collateral += _collateral;
            position.liqPrice = calcLiquidationPrice(position);
            require(_currentPrice > position.liqPrice);
            longPositions[_futureId][trader] = position;
            emit IncreaseCollateral(position.marketId, position.positionId, trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
        } else {
            revert();
        }
    }

    // NUEVA DECREASE POSITION FUNCTION
    function _decreasePosition(
        address trader,
        uint256 _futureId,
        uint256 _percentageDecrease, // percentage with 2 decimals (0-10000);
        uint256 _currentPrice,
        bool _keepLeverageRatio,
        bool _long
    ) internal  {
        if (!validFuture(_futureId)) revert Futures__FutureDoesNotExists();
        // require(priceFeed.isAcceptablePrice(_futureId, _currentPrice));

        _keepLeverageRatio = true; // will be used in the future for users to decide (now always true)

        if (_long) {
            Position memory position = longPositions[_futureId][trader];
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
                    emit DecreasePosition(position.marketId, position.positionId, trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
                    require(_currentPrice > position.liqPrice);
                    longPositions[_futureId][trader] = position;
                    if (collateralToDecrease < usdcOut) {
                        USDC.safeTransfer(trader, collateralToDecrease);
                    } else {
                        USDC.safeTransfer(trader, usdcOut);
                    }
                    liquidityPool.benefitsToTrader(
                        trader,
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
                        delete longPositions[_futureId][trader];
                        liquidityPool.benefitsToTrader(
                            trader,
                            fromLiquidityPool
                        );
                        USDC.safeTransfer(trader, fromCollateral);
                    } else {
                        fromCollateral = usdcOut;
                        liquidityPool.unblockLiquidity(position.collateral * 9);
                        delete longPositions[_futureId][trader];
                        USDC.safeTransfer(trader, fromCollateral);
                    }
                    emit ClosePosition(position.marketId, position.positionId, trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
                }
            } else {
                revert(); // modify ratio not yet available
            }
        } else {    
            revert(); // shorts not yet available
        }
    }

    // NEW FUNCTION
    function _decreaseCollateral(
        address trader,
        uint256 _futureId,
        uint256 _percentageDecrease,
        uint256 _currentPrice,
        bool _long
    ) internal  {
        if (!validFuture(_futureId)) revert Futures__FutureDoesNotExists();
        // require(priceFeed.isAcceptablePrice(_futureId, _currentPrice));
        uint256 collateralOut;

        if (_long) {
            Position memory position = longPositions[_futureId][trader];
            require(position.long);
            require(position.size != 0);

            collateralOut = (position.collateral * _percentageDecrease) / 10000;
            position.collateral -= collateralOut;
            position.size -= collateralOut;
            uint256 leverage = position.size - position.collateral;
            uint256 tokenAmount = ((position.size * 1e12) /
                position.entryPrice) / 1e6;
            position.liqPrice =
                ((((leverage * 1e12) / tokenAmount) * 10005) / 10000) /
                1e6;
            USDC.safeTransfer(trader, collateralOut);
            liquidityPool.unblockLiquidity(collateralOut * 9);
            longPositions[_futureId][trader] = position;
            emit DecreaseCollateral(position.marketId, position.positionId, trader, position.startedAt, position.size, position.collateral, position.entryPrice, position.liqPrice, position.long, _currentPrice);
        } else {
            revert(); // shorts not yet available
        }
    }

    // function to liquidate positions
    // Note that _currentPrice param will be deleted as will be obtained through the priceFeed
    function liquidatePosition(
        uint256 _futureId,
        address _trader,
        bool _long
    ) external  {
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

    // function stopLossOrder() external whenNotPaused {}

    // function takeProfitOrder() external whenNotPaused {}

    function validFuture(uint256 _futureId) public view returns (bool) {
        return (_futureId != 0 && _futureId <= counter);
    }

    // function setPause(bool _paused) external {
    //     bool currentState = paused();
    //     if (_paused && !currentState) {
    //         _pause();
    //     } else if (!_paused && currentState) {
    //         _unpause();
    //     }
    // }

    function setGovernance(address _newGovernance) external onlyGov {
        emit UpdatedGovernance(governance, _newGovernance);
        governance = _newGovernance;
    }

    function setTradingFees(
        uint256 _makerFee,
        uint256 _takerFee
    ) external onlyGov {
        makerTradingFee = _makerFee;
        takerTradingFee = _takerFee;
    }

    function setpriceImpactFee(uint256 _priceImpactFee) external onlyGov {
        priceImpactFee = _priceImpactFee;
    }

    function setfundingFee(uint256 _fundingFee) external onlyGov {
        fundingFee = _fundingFee;
    }

    function setborrowingFee(uint256 _borrowingFee) external onlyGov {
        borrowingFee = _borrowingFee;
    }

    function setexecutionFee(uint256 _executionFee) external onlyGov {
        executionFee = _executionFee;
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

    // function version() external pure returns (uint256) {
    //     return 1;
    // }

    // function _authorizeUpgrade(
    //     address newImplementation
    // ) internal virtual override onlyOwner {}

    // /**
    //  * @dev This empty reserved space is put in place to allow future versions to add new
    //  * variables without shifting down storage in the inheritance chain.
    //  * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    //  */
    // uint256[50] private __gap;
}
