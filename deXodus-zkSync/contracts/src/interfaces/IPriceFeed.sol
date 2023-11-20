// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

interface IPriceFeed {
    function isAcceptablePrice(uint256 _futureId, uint256 _entryPrice) external view returns (bool);
    function getPrice(uint256 _market) external view returns (uint256);
    function mockGetUsdPriceFromChainlink(address _token) external view returns (uint256);
}