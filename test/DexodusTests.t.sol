// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {DeployProtocol} from "../../script/DeployProtocol.s.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Futures} from "../../src/Futures.sol";
import {LiquidityPool} from "../../src/LiquidityPool.sol";
import {console, Test} from "forge-std/Test.sol";
import {LiquidityPool} from "../../src/LiquidityPool.sol";
import {Futures} from "../../src/Futures.sol";

contract FuturesTest is Test {
    address public owner;
    address public alice;
    address public bobby;
    address public carla;
    address public edgar;
    address public liqPr1;
    address public liqPr2;
    address public liqPr3;

    uint256 deployerKey;

    Futures public futures;
    LiquidityPool public liquidityPool;

    address public futuresAddr;
    address public liquidityPoolAddr;

    address wbtcAddr;
    address wethAddr;
    address usdcAddr;

    IERC20 wbtc;
    IERC20 weth;
    IERC20 usdc;

    HelperConfig helperConfig;

    /*##############################################################################################################################
    #######################################################                   ######################################################
    ######################################################        SETUP        #####################################################
    #######################################################                   ######################################################
    ##############################################################################################################################*/

    function setUp() external {
        alice = vm.addr(0xAA);
        bobby = vm.addr(0xAB);
        carla = vm.addr(0xAE);
        edgar = vm.addr(0xEA);

        liqPr1 = vm.addr(0x1AA);
        liqPr2 = vm.addr(0x1AB);
        liqPr3 = vm.addr(0x1EE);

        // vm.startPrank(owner);
        DeployProtocol deployer = new DeployProtocol();
        (futuresAddr, liquidityPoolAddr, usdcAddr, helperConfig,,) = deployer
            .run();

        (wethAddr, wbtcAddr, deployerKey,,) = helperConfig.activeNetworkConfig();

        usdc = IERC20(usdcAddr);
        owner = vm.addr(vm.envUint("PRIVATE_KEY"));

        vm.startPrank(owner);

        deal(usdcAddr, alice, 10_000e6);
        deal(usdcAddr, bobby, 1_000e6);
        deal(usdcAddr, carla, 1_000e6);
        deal(usdcAddr, edgar, 1_000e6);

        deal(usdcAddr, owner, 100_000e6);
        deal(usdcAddr, liqPr1, 100_000e6);
        deal(usdcAddr, liqPr2, 100_000e6);
        deal(usdcAddr, liqPr3, 100_000e6);

        liquidityPool = LiquidityPool(liquidityPoolAddr);
        futures = Futures(futuresAddr);
        vm.stopPrank();

        vm.startPrank(owner);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(owner));
        liquidityPool.addLiquidity(owner, 100_000e6);
        // console.log(liquidityPool.balanceOf(owner));
        vm.stopPrank();

        vm.label(owner, "Owner");
        vm.label(alice, "Alice");
        vm.label(bobby, "Bobby");
        vm.label(carla, "Carla");
        vm.label(edgar, "Edgar");
        vm.label(liqPr1, "Liquidity Provider 1");
        vm.label(liqPr2, "Liquidity Provider 2");
        vm.label(liqPr3, "Liquidity Provider 3");
        vm.label(futuresAddr, "Futures");
        vm.label(liquidityPoolAddr, "Liquidity Pool");
    }

    /*##############################################################################################################################
    #######################################################                   ######################################################
    ######################################################        TESTS        #####################################################
    #######################################################                   ######################################################
    ##############################################################################################################################*/



    // You can create a position
    function testIPL0() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        // console.log(address(futures));
        futures.increasePosition(2, 1000e6, 100e6, 2000e6, true);

        _logPosition(2, alice, true);
    }

    // you can increase the position after create one
    function testIPL1() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(2, 1000e6, 100e6, 2000e6, true);

        _logPosition(2, alice, true);

        vm.warp(120000);
        futures.increasePosition(2, 2000e6, 200e6, 2500e6, true);

        _logPosition(2, alice, true);
        vm.stopPrank();
    }

    // you can increase the position 2 times after create the position and the liqPosition and oher data makes sense
    function testIPL2() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(1, 50000e6, 1000e6, 28000e6, true);

        _logPosition(1, alice, true);

        vm.warp(120000);
        futures.increasePosition(1, 20000e6, 1000e6, 30000e6, true);

        _logPosition(1, alice, true);

        vm.warp(150000);
        futures.increasePosition(1, 20000e6, 1000e6, 32000e6, true);

        _logPosition(1, alice, true);
        vm.stopPrank();
    }

    // you can increase the position with adding 0 collateral
    function testIPL3() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(2, 750e6, 250e6, 1500e6, true);

        _logPosition(2, alice, true);

        vm.warp(120000);
        futures.increasePosition(2, 5000e6, 500e6, 1200e6, true);

        _logPosition(2, alice, true);

        vm.warp(150000);
        futures.increasePosition(2, 5000e6, 0, 1200e6, true);

        _logPosition(2, alice, true);
        vm.stopPrank();
    }

    function testIPL4() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(2, 150e6, 10e6, 1800e6, true);

        _logPosition(2, alice, true);

        vm.warp(120000);
        futures.increasePosition(2, 30e6, 20e6, 1500e6, true);

        _logPosition(2, alice, true);
        vm.stopPrank();
    }

    function testIPL5() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(2, 150e6, 10e6, 1800e6, true);

        _logPosition(2, alice, true);

        vm.warp(120000);
        futures.increasePosition(2, 30e6, 20e6, 2000e6, true);

        _logPosition(2, alice, true);
        vm.stopPrank();
    }

    function testIPL6() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(2, 1000e6, 200e6, 1650e6, true);

        _logPosition(2, alice, true);

        vm.warp(120000);
        futures.increasePosition(2, 15000e6, 1000e6, 1350e6, true);

        _logPosition(2, alice, true);
        vm.stopPrank();
    }

    // an increase position that goes directly to liqprice should revert (is it possible?)
    function testIPL7() public {
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        vm.warp(100000);
        futures.increasePosition(1, 10000e6, 1000e6, 28000e6, true);

        _logPosition(1, alice, true);

        vm.warp(120000);
        vm.expectRevert();
        futures.increasePosition(1, 30000e6, 0, 25400e6, true);

        _logPosition(1, alice, true);
        vm.stopPrank();
    }

    /*############################################################################
    #################################    CORE    #################################
    ############################################################################*/

    function testGuardiansCore() public {
        logLiqPrBlance(liqPr1, "LIQPR1");
        logLiqPrBlance(liqPr2, "LIQPR2");
        logLiqPrBlance(liqPr3, "LIQPR3");
        logUsdcBlance(alice, "ALICE");
        logUsdcBlance(bobby, "BOBBY");
        logUsdcBlance(carla, "CARLA");

        vm.startPrank(liqPr1);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(liqPr1));
        liquidityPool.addLiquidity(liqPr1, 100_000e6);
        vm.stopPrank();

        vm.startPrank(liqPr2);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(liqPr2));
        liquidityPool.addLiquidity(liqPr2, 100_000e6);
        vm.stopPrank();

        vm.startPrank(liqPr3);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(liqPr3));
        liquidityPool.addLiquidity(liqPr3, 100_000e6);
        vm.stopPrank();

        // ETH  1600
        // BTC 33000

        vm.startPrank(alice);
        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, 1000e6, 100e6, 1600e6, true);
        futures.increasePosition(2, 1000e6, 100e6, 33000e6, true);
        vm.stopPrank();

        console.log(futures.positionNetValue(1600e6, alice, true, 1));

        vm.startPrank(bobby);
        usdc.approve(futuresAddr, usdc.balanceOf(bobby));
        futures.increasePosition(1, 1000e6, 100e6, 1600e6, true);
        futures.increasePosition(2, 1000e6, 100e6, 33000e6, true);
        vm.stopPrank();

        console.log(futures.positionNetValue(1600e6, bobby, true, 1));

        // ETH  2500
        // BTC 40000

        console.log(futures.positionNetValue(2500e6, alice, true, 1));

        vm.startPrank(alice);
        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, 1000e6, 200e6, 2500e6, true);
        futures.increasePosition(2, 1000e6, 200e6, 40000e6, true);
        vm.stopPrank();

        console.log(futures.positionNetValue(1600e6, alice, true, 1));

        // ETH  3000
        // BTC 50000

        vm.startPrank(carla);
        usdc.approve(futuresAddr, usdc.balanceOf(carla));
        futures.increasePosition(1, 500e6, 100e6, 3000e6, true);
        vm.stopPrank();

        vm.startPrank(alice);
        futures.decreasePosition(1, 5000, 3000e6, true, true); // 50% of position decreasing
        futures.decreasePosition(2, 5000, 50000e6, true, true); // 50% of position decreasing
        vm.stopPrank();

        console.log(futures.positionNetValue(3000e6, alice, true, 1));
        console.log(futures.positionNetValue(3000e6, bobby, true, 1));
        console.log(futures.positionNetValue(3000e6, carla, true, 1));

        vm.startPrank(liqPr3);
        liquidityPool.withdrawLiquidity(
            liqPr3,
            liquidityPool.balanceOf(liqPr3)
        );
        vm.stopPrank();

        // ETH  2250
        // BTC 36000

        vm.startPrank(carla);
        usdc.approve(futuresAddr, usdc.balanceOf(carla));
        futures.decreasePosition(1, 10000, 2750e6, true, true);
        vm.stopPrank();

        vm.startPrank(alice);
        futures.decreasePosition(1, 10000, 2250e6, true, true); // 50% of position decreasing
        futures.decreasePosition(2, 10000, 36000e6, true, true); // 50% of position decreasing
        vm.stopPrank();

        console.log(futures.positionNetValue(2250e6, alice, true, 1));
        console.log(futures.positionNetValue(2250e6, bobby, true, 1));
        console.log(futures.positionNetValue(2250e6, carla, true, 1));

        vm.startPrank(bobby);
        futures.decreasePosition(1, 10000, 2250e6, true, true); // 50% of position decreasing
        futures.decreasePosition(2, 10000, 36000e6, true, true); // 50% of position decreasing
        vm.stopPrank();

        console.log(futures.positionNetValue(2250e6, alice, true, 1));
        console.log(futures.positionNetValue(2250e6, bobby, true, 1));
        console.log(futures.positionNetValue(2250e6, carla, true, 1));

        vm.startPrank(liqPr1);
        liquidityPool.withdrawLiquidity(
            liqPr1,
            liquidityPool.balanceOf(liqPr1)
        );
        vm.stopPrank();

        vm.startPrank(liqPr2);
        liquidityPool.withdrawLiquidity(
            liqPr2,
            liquidityPool.balanceOf(liqPr2)
        );
        vm.stopPrank();

        logLiqPrBlance(liqPr1, "LIQPR1");
        logLiqPrBlance(liqPr2, "LIQPR2");
        logLiqPrBlance(liqPr3, "LIQPR3");
        logUsdcBlance(alice, "ALICE");
        logUsdcBlance(bobby, "BOBBY");
        logUsdcBlance(carla, "CARLA");
    }

    /*############################################################################
    #####################    DECREASE POSITIONS KEEP RATIO   #####################
    ############################################################################*/

    function testDPKL1() public {
        // FIRST INCREASE POSITION PARAMS:
        uint256 size = 1000e6;
        uint256 collateral = 100e6;
        uint256 entryPrice = 2000e6;
        bool long = true;

        // SECOND DECREASE POSITION PARAMS:
        uint256 percentageDecrease = 5000;
        uint256 currentPrice = 2500e6;
        bool keepLeverageRatio = true;

        // EXPECTED OUTPUTS
        uint256 usdcOut = 175e6;
        uint256 newLeverage = 450e6;

        deal(usdcAddr, alice, collateral);
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, size, collateral, entryPrice, long);

        uint256 id = 1;
        address user = alice;
        (, , , , uint256 liqPriceBefore, , ) = futures.getTraderPosition(
            id,
            user,
            long
        );

        futures.decreasePosition(
            1,
            percentageDecrease,
            currentPrice,
            keepLeverageRatio,
            true
        );

        (
            ,
            uint256 finalSize,
            uint256 finalCollateral,
            ,
            uint256 liqPriceAfter,
            ,

        ) = futures.getTraderPosition(id, user, long);

        vm.stopPrank();

        assertEq(liqPriceBefore, liqPriceAfter);
        assertEq(newLeverage, finalSize - finalCollateral);
        assertEq(usdcOut, usdc.balanceOf(alice));
    }

    function testDPKL2() public {
        // FIRST INCREASE POSITION PARAMS:
        uint256 size = 50000e6;
        uint256 collateral = 1000e6;
        uint256 entryPrice = 28000e6;
        bool long = true;

        // SECOND DECREASE POSITION PARAMS:
        uint256 percentageDecrease = 2500;
        uint256 currentPrice = 30000e6;
        bool keepLeverageRatio = true;

        // EXPECTED OUTPUTS
        uint256 usdcOut = 1143e6;
        uint256 newLeverage = 36750e6;

        deal(usdcAddr, alice, collateral);
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(2, size, collateral, entryPrice, long);

        address user = alice;
        (, , , , uint256 liqPriceBefore, , ) = futures.getTraderPosition(
            2,
            user,
            long
        );

        futures.decreasePosition(
            2,
            percentageDecrease,
            currentPrice,
            keepLeverageRatio,
            true
        );

        (
            ,
            uint256 finalSize,
            uint256 finalCollateral,
            ,
            uint256 liqPriceAfter,
            ,

        ) = futures.getTraderPosition(2, user, long);

        assertEqPercent(liqPriceBefore, liqPriceAfter, 1); // margin error of 0.01%
        assertEq(newLeverage, finalSize - finalCollateral);
        assertEqPercent(usdcOut, usdc.balanceOf(alice), 5); // margin error of 0.05%
    }

    function testDPKL3() public {
        // FIRST INCREASE POSITION PARAMS:
        uint256 size = 750e6;
        uint256 collateral = 250e6;
        uint256 entryPrice = 1500e6;
        bool long = true;

        // SECOND DECREASE POSITION PARAMS:
        uint256 percentageDecrease = 1000;
        uint256 currentPrice = 2000e6;
        bool keepLeverageRatio = true;

        // EXPECTED OUTPUTS
        uint256 usdcOut = 50e6;
        uint256 newLeverage = 450e6;

        deal(usdcAddr, alice, collateral);
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, size, collateral, entryPrice, long);

        address user = alice;
        (, , , , uint256 liqPriceBefore, , ) = futures.getTraderPosition(
            1,
            user,
            long
        );

        futures.decreasePosition(
            1,
            percentageDecrease,
            currentPrice,
            keepLeverageRatio,
            true
        );

        (
            ,
            uint256 finalSize,
            uint256 finalCollateral,
            ,
            uint256 liqPriceAfter,
            ,

        ) = futures.getTraderPosition(1, user, long);

        assertEqPercent(liqPriceBefore, liqPriceAfter, 1); // margin error of 0.01%
        assertEq(newLeverage, finalSize - finalCollateral);
        assertEqPercent(usdcOut, usdc.balanceOf(alice), 5); // margin error of 0.05%
    }

    function testDPKL4() public {
        // FIRST INCREASE POSITION PARAMS:
        uint256 size = 150e6;
        uint256 collateral = 10e6;
        uint256 entryPrice = 1800e6;
        bool long = true;

        // SECOND DECREASE POSITION PARAMS:
        uint256 percentageDecrease = 10000;
        uint256 currentPrice = 2000e6;
        bool keepLeverageRatio = true;

        // EXPECTED OUTPUTS
        uint256 usdcOut = 2667e4;
        uint256 newLeverage = 0;

        deal(usdcAddr, alice, collateral);
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, size, collateral, entryPrice, long);

        address user = alice;
        (, , , , uint256 liqPriceBefore, , ) = futures.getTraderPosition(
            1,
            user,
            long
        );

        futures.decreasePosition(
            1,
            percentageDecrease,
            currentPrice,
            keepLeverageRatio,
            true
        );

        (
            ,
            uint256 finalSize,
            uint256 finalCollateral,
            ,
            uint256 liqPriceAfter,
            ,

        ) = futures.getTraderPosition(1, user, long);

        assertEq(0, liqPriceAfter);
        assertEq(newLeverage, finalSize - finalCollateral);
        assertEqPercent(usdcOut, usdc.balanceOf(alice), 5); // margin error of 0.05%
    }

    function testDPKL5() public {
        // FIRST INCREASE POSITION PARAMS:
        uint256 size = 150e6;
        uint256 collateral = 10e6;
        uint256 entryPrice = 1800e6;
        bool long = true;

        // SECOND DECREASE POSITION PARAMS:
        uint256 percentageDecrease = 5000;
        uint256 currentPrice = 1750e6;
        bool keepLeverageRatio = true;

        // EXPECTED OUTPUTS
        uint256 usdcOut = 2917e3;
        uint256 newLeverage = 70e6;

        deal(usdcAddr, alice, collateral);
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, size, collateral, entryPrice, long);

        address user = alice;
        (, , , , uint256 liqPriceBefore, , ) = futures.getTraderPosition(
            1,
            user,
            long
        );

        futures.decreasePosition(
            1,
            percentageDecrease,
            currentPrice,
            keepLeverageRatio,
            true
        );

        (
            ,
            uint256 finalSize,
            uint256 finalCollateral,
            ,
            uint256 liqPriceAfter,
            ,

        ) = futures.getTraderPosition(1, user, long);

        assertEqPercent(liqPriceBefore, liqPriceAfter, 1); // margin error of 0.01%
        assertEq(newLeverage, finalSize - finalCollateral);
        assertEqPercent(usdcOut, usdc.balanceOf(alice), 5); // margin error of 0.05%
    }

    function testDPKL6() public {
        // FIRST INCREASE POSITION PARAMS:
        uint256 size = 1000e6;
        uint256 collateral = 200e6;
        uint256 entryPrice = 1650e6;
        bool long = true;

        // SECOND DECREASE POSITION PARAMS:
        uint256 percentageDecrease = 5000;
        uint256 currentPrice = 2000e6;
        bool keepLeverageRatio = true;

        // EXPECTED OUTPUTS
        uint256 usdcOut = 2061e5;
        uint256 newLeverage = 400e6;

        deal(usdcAddr, alice, collateral);
        vm.startPrank(alice);

        usdc.approve(futuresAddr, usdc.balanceOf(alice));
        futures.increasePosition(1, size, collateral, entryPrice, long);

        address user = alice;
        (, , , , uint256 liqPriceBefore, , ) = futures.getTraderPosition(
            1,
            user,
            long
        );

        futures.decreasePosition(
            1,
            percentageDecrease,
            currentPrice,
            keepLeverageRatio,
            true
        );

        (
            ,
            uint256 finalSize,
            uint256 finalCollateral,
            ,
            uint256 liqPriceAfter,
            ,

        ) = futures.getTraderPosition(1, user, long);

        assertEqPercent(liqPriceBefore, liqPriceAfter, 1); // margin error of 0.01%
        assertEq(newLeverage, finalSize - finalCollateral);
        assertEqPercent(usdcOut, usdc.balanceOf(alice), 5); // margin error of 0.05%
    }

    function testDPKL7() public {
        
    }

    // user can provide liquidity
    function testLP001() public {
        vm.startPrank(liqPr1);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(liqPr1));
        console.log("usdc -----> ", address(usdc));
        liquidityPool.addLiquidity(liqPr1, 10_000e6);
        vm.stopPrank();
    }

    // total supply and LP balance for user is calculated as expected
    function testLP002() public {
        vm.startPrank(liqPr1);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(liqPr1));
        liquidityPool.addLiquidity(liqPr1, 100_000e6);
        vm.stopPrank();
        uint256 balanceLiqPr = liquidityPool.balanceOf(liqPr1);
        uint256 totalSupply = liquidityPool.totalSupply();
        assertEq(balanceLiqPr, ((100_000e6 * 10 * 1e18) / 1e6) - 1);
        assertEq(balanceLiqPr, totalSupply - liquidityPool.balanceOf(owner));
    }

    // withdraw liquidity
    function testLP003() public {
        vm.startPrank(liqPr1);
        IERC20(usdc).approve(liquidityPoolAddr, usdc.balanceOf(liqPr1));
        uint256 firstUsdcAmount = usdc.balanceOf(liqPr1);
        uint256 amountIn = 100_000e6;
        liquidityPool.addLiquidity(liqPr1, amountIn);
        liquidityPool.withdrawLiquidity(
            liqPr1,
            liquidityPool.balanceOf(liqPr1)
        );
        assertEq(liquidityPool.totalSupply(), liquidityPool.balanceOf(owner));
        assertEq(usdc.balanceOf(liqPr1), firstUsdcAmount - 1);
        vm.stopPrank();
    }
    

    /*###############################################################################################################################
    #######################################################                    ######################################################
    ######################################################       HELPERS        #####################################################
    #######################################################                    ######################################################
    ###############################################################################################################################*/

    function logPosition(uint256 id, address user, bool long) internal {
        (
            uint256 a,
            uint256 b,
            uint256 c,
            uint256 d,
            uint256 e,
            ,
            uint256 f
        ) = futures.getTraderPosition(id, user, long);
        console.log("------------------------------------------");
        console.log("##########    POSITION LOGS     ##########");
        console.log("------------------------------------------");
        console.log("startedAt -----> ", a);
        console.log("size      -----> ", b);
        console.log("collateral ----> ", c);
        console.log("entryPrice ----> ", d);
        console.log("liqPrice  -----> ", e);
        console.log("long      -----> ", long);
        // /console.log("market    -----> ", f);
        console.log("------------------------------------------");
    }

    function logUsdcBlance(address user, string memory name) internal {
        console.log("%s  USDC BALANCE -------> ", name, usdc.balanceOf(user));
    }

    function logLiqPrBlance(address user, string memory name) internal {
        console.log("%s USDC BALANCE -------> ", name, usdc.balanceOf(user));
        console.log("%s PPLP BALANCE -------> ", name, liquidityPool.balanceOf(user));
    }

    function _logPosition(uint256 id, address user, bool long) internal {
        (
            uint256 a,
            uint256 b,
            uint256 c,
            uint256 d,
            uint256 e,
            ,
            uint256 f
        ) = futures.getTraderPosition(id, user, long);
        console.log("------------------------------------------");
        console.log("##########    POSITION LOGS     ##########");
        console.log("------------------------------------------");
        console.log("startedAt -----> ", a);
        console.log("size      -----> ", b);
        console.log("collateral ----> ", c);
        console.log("entryPrice ----> ", d);
        console.log("liqPrice  -----> ", e);
        console.log("long      -----> ", long);
        // /console.log("market    -----> ", f);
        console.log("------------------------------------------");
    }

    function assertEqPercent(
        uint256 value1,
        uint256 value2,
        uint256 percentAllowed
    ) internal {
        // ej percent allowed: 50 (= 0.5%), 500 (= 5%), 5000 (50%), 10000 (100%)
        uint256 diff = (value1 * percentAllowed) / 10000;
        uint256 value2max = value1 + diff;
        uint256 value2min = value1 - diff;
        assertGt(value2, value2min);
        assertLt(value2, value2max);
    }

    function assertGtPercent(
        uint256 value1,
        uint256 value2,
        uint256 percentAllowed
    ) internal {
        // ej percent allowed: 50 (= 0.5%), 500 (= 5%), 5000 (50%), 10000 (100%)
    }

    function assertLtPercent(
        uint256 value1,
        uint256 value2,
        uint256 percentAllowed
    ) internal {
        // ej percent allowed: 50 (= 0.5%), 500 (= 5%), 5000 (50%), 10000 (100%)
    }

}