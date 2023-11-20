// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IProxy} from "@api3/contracts/v0.8/interfaces/IProxy.sol";

// import {console} from "../lib/hardhat/packages/hardhat-core/console.sol";

contract PriceFeed is UUPSUpgradeable, Ownable2StepUpgradeable {
    mapping(address token => AggregatorV3Interface priceFeed) public s_tokenPriceFeed;
    mapping(address token => uint256 priceFeed) public s_tokenPrice;

    address public USDC;

    address public wbtc;
    address public weth;


    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _usdc,
        address[] memory _tokens,
        address[] memory _priceFeed,
        address _wbtc,
        address _weth
    ) external initializer {
        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        _transferOwnership(msg.sender);

        USDC = _usdc;
        wbtc = _wbtc;
        weth = _weth;

        for (uint256 i; i < _tokens.length; i++) {
            s_tokenPriceFeed[_tokens[i]] = AggregatorV3Interface(_priceFeed[i]);
        }
    }

    function readDataFeedFromApi3(address proxyAddress) public view returns (uint224) {
        (int224 value, uint256 timestamp) = IProxy(proxyAddress).read();
        return uint224(value);
    }

    function getUsdPriceFromChainlink(address _token) public view returns (uint256) {
        AggregatorV3Interface priceFeed = s_tokenPriceFeed[_token];
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    // FUNCTION TO CHECK IF THE PRICE OF THE TRANSACTION IS CORRECT
    function isAcceptablePrice(
        uint256 _futureId,
        uint256 _entryPrice
        /*bool _long*/
    ) external view returns (bool) {
        bool _long = true; //only longs for now!
        // ej percent allowed: 10 (= 0.1%), 50 (= 0.5%), 500 (= 5%), 5000 (50%), 10000 (100%)
        uint256 diff = (_entryPrice * 50) / 10000;
        uint256 value2max = _entryPrice + diff;
        uint256 value2min = _entryPrice - diff;

        uint256 currentPrice;

        uint256 id;
        assembly {
            id := chainid()
        }

        if (id == 280) { // zkSync testnet
            return true;
            // if (_futureId == 1) {
            //     currentPrice = readDataFeedFromApi3(address(0xe5Cf15fED24942E656dBF75165aF1851C89F21B5));
            // } else {
            //     currentPrice = readDataFeedFromApi3(address(0x26690F9f17FdC26D419371315bc17950a0FC90eD));
            // }
            // currentPrice = currentPrice * 1e6 / 1e18;
        } else {
            if (_futureId == 1) {
                currentPrice = getUsdPriceFromChainlink(wbtc);
            } else {
                currentPrice = getUsdPriceFromChainlink(weth);
            }
            currentPrice = currentPrice * 1e6 / 1e8;
        }

        // console.log("diff         -> ", diff);
        // console.log("value2max    -> ", value2max);
        // console.log("value2min    -> ", value2min);
        // console.log("currentPrice -> ", currentPrice);

        if (_long) {
            if (currentPrice <= value2min) {
                return false;
            }
        } else {
            if (currentPrice >= value2max) {
                return false;
            }
        }
        return true;
    }

    // function only for testing and mock the price always as acceptable
    // function isAcceptablePrice(
    //     uint256 _futureId,
    //     uint256 _entryPrice
    // ) external view returns (bool) {
    //     return true;
    // }

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

    // MOCK FUNCTIONS
    function mockChangePrice(address _token, uint256 _price) public {
        s_tokenPrice[_token] = _price;
    }
    function mockGetUsdPriceFromChainlink(address _token) public view returns (uint256) {
        return s_tokenPrice[_token];
    }

}
