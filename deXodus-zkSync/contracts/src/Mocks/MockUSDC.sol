// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract MockUSDC is UUPSUpgradeable, Ownable2StepUpgradeable, ERC20Upgradeable {

    constructor() {
        _disableInitializers();
    }

    function initialize(string memory _name, string memory _symbol) external initializer {
        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        __ERC20_init(_name, _symbol);

        _transferOwnership(msg.sender);

        _mint(msg.sender, 10_000_000e6);
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}

    uint256[50] private __gap;


}