// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        address weth;
        address wbtc;
        uint256 deployerKey;
        address wbtcUsdPriceFeed;
        address wethUsdPriceFeed;
    }

    constructor() {
        uint256 id;
        assembly {
            id := chainid()
        }
        if (id == 421613) {
            activeNetworkConfig = getArbitrumGoerliConfig();
        } else if (id == 421614) {
            activeNetworkConfig = getArbitrumSepoliaConfig();
        } else if (id == 11155111) {
            activeNetworkConfig = getEthereumSepoliaConfig();
        } else {
            activeNetworkConfig = getEthereumMainnetForkConfig();
        }
    }

    function getEthereumMainnetForkConfig()
        public
        view
        returns (NetworkConfig memory arbitrumGoerliNetworkConfig)
    {
        arbitrumGoerliNetworkConfig = NetworkConfig({
            weth: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,
            wbtc: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,
            wethUsdPriceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH / USD
            wbtcUsdPriceFeed: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getEthereumSepoliaConfig()
        public
        view
        returns (NetworkConfig memory arbitrumGoerliNetworkConfig)
    {
        arbitrumGoerliNetworkConfig = NetworkConfig({
            weth: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9,
            wbtc: 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,
            wethUsdPriceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH / USD
            wbtcUsdPriceFeed: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getArbitrumGoerliConfig()
        public
        view
        returns (NetworkConfig memory arbitrumGoerliNetworkConfig)
    {
        arbitrumGoerliNetworkConfig = NetworkConfig({
            weth: 0xF4e3B0de5021d400A3D2F4A5F286593D447d7569,
            wbtc: 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063,
            wethUsdPriceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH / USD
            wbtcUsdPriceFeed: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getArbitrumSepoliaConfig()
        public
        view
        returns (NetworkConfig memory arbitrumGoerliNetworkConfig)
    {
        arbitrumGoerliNetworkConfig = NetworkConfig({
            weth: 0x980B62Da83eFf3D4576C647993b0c1D7faf17c73,
            wbtc: 0x806D0637Fbbfb4EB9efD5119B0895A5C7Cbc66e7,
            wethUsdPriceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH / USD
            wbtcUsdPriceFeed: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }
}