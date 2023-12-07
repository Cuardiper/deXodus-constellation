// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {Futures} from "../src/Futures.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {MockToken} from "../src/mocks/MockUSDC.sol";
import {EXD} from "../src/EXD.sol";
import {PriceFeed} from "../src/PriceFeed.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployProtocol is Script {
    address[] public tokens;
    address[] public priceFeed;

    address weth;
    address wbtc;
    address usdc;
    uint256 deployerKey;

    address wethUsdPriceFeed;
    address wbtcUsdPriceFeed;

    function run() external returns (
        address payable futuresAddr,
        address liquidityPoolAddr,
        address mockUsdcAddr,
        HelperConfig helperConfig,
        address exdAddr,
        address priceFeedAddr
        )
    {

        helperConfig = new HelperConfig();

        (weth, wbtc, deployerKey, wbtcUsdPriceFeed, wethUsdPriceFeed) = helperConfig.activeNetworkConfig();

        vm.startBroadcast(deployerKey);

        // futuresAddr = payable(_deployFutures());
        liquidityPoolAddr = _deployLiquidityPool();
        mockUsdcAddr = _deployMockUSDC();
        exdAddr = _deployEXD();
        priceFeedAddr = _deployPriceFeed();

        tokens.push(wbtc);
        tokens.push(weth);
        priceFeed.push(wbtcUsdPriceFeed);
        priceFeed.push(wethUsdPriceFeed);

        PriceFeed(priceFeedAddr).initialize(
            usdc,
            tokens,
            priceFeed,
            wbtc,
            weth
        );

        MockToken(mockUsdcAddr).initialize("Mock USDC", "mUSDC");

        EXD(exdAddr).initialize("deXodus Exchange", "EXD");

        futuresAddr = payable(address(new Futures(liquidityPoolAddr,
            priceFeedAddr,
            mockUsdcAddr,
            weth,
            wbtc,
            10005)));

        // LIQUIDITY POOL INITIALIZATION
        LiquidityPool(liquidityPoolAddr).initialize(
            mockUsdcAddr,
            "deXodus LP",
            "EXDLP",
            futuresAddr
        );

        // address payable verifier = payable(address(0x2ff010DEbC1297f19579B4246cad07bd24F2488A));
        // string[] memory feedsHex = new string[](2);
        // feedsHex[0] = "0x00020ffa644e6c585a5bec0e25ca476b9538198259e22b6240957720dcba0e14";
        // feedsHex[1] = "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b";
        // address linkToken = address(0xb1D4538B4571d411F07960EF2838Ce337FE1E80E);

        // // FUTURES INITIALIZATION
        // Futures(futuresAddr).initialize(
        //     liquidityPoolAddr,
        //     priceFeedAddr,
        //     mockUsdcAddr,
        //     weth,
        //     wbtc,
        //     10005
        //     // verifier,
        //     // feedsHex,
        //     // linkToken
        // );

        Futures(futuresAddr).createFuture("WBTC:USDC");
        Futures(futuresAddr).createFuture("WETH:USDC");

        vm.stopBroadcast();

        return (
            futuresAddr,
            liquidityPoolAddr,
            mockUsdcAddr,
            helperConfig,
            exdAddr,
            priceFeedAddr
        );
    }

    // function _deployFutures() internal returns (address) {
    //     Futures futures = new Futures();
    //     bytes memory bytess;
    //     ERC1967Proxy futuresProxy = new ERC1967Proxy(address(futures), bytess);
    //     return address(futuresProxy);
    // }

    function _deployLiquidityPool() internal returns (address) {
        LiquidityPool liquidityPool = new LiquidityPool();
        bytes memory bytess;
        ERC1967Proxy liquidityPoolProxy = new ERC1967Proxy(
            address(liquidityPool),
            bytess
        );
        return address(liquidityPoolProxy);
    }

    function _deployMockUSDC() internal returns (address) {
        MockToken mockUSDC = new MockToken();
        ERC1967Proxy mockUSDCProxy = new ERC1967Proxy(
            address(mockUSDC),
            ""
        );
        return address(mockUSDCProxy);
    }

    function _deployEXD() internal returns (address) {
        EXD exd = new EXD();
        bytes memory bytess;
        ERC1967Proxy exdProxy = new ERC1967Proxy(address(exd), bytess);
        return address(exdProxy);
    }

    function _deployPriceFeed() internal returns (address) {
        PriceFeed _priceFeed = new PriceFeed();
        bytes memory bytess;
        ERC1967Proxy priceFeedProxy = new ERC1967Proxy(address(_priceFeed), bytess);
        return address(priceFeedProxy);
    }
        

    
}