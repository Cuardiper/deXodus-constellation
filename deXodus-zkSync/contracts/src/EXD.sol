// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract EXD is UUPSUpgradeable, Ownable2StepUpgradeable, ERC20Upgradeable {
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory _name, string memory _symbol) external initializer {
        __UUPSUpgradeable_init();
        __Ownable2Step_init();
        __ERC20_init(_name, _symbol);

        _mint(msg.sender, 10_000);
    }

    function mintMock(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address _from, uint256 _amount) public { //onlychests
        _burn(_from, _amount);
    }

    function version() external pure returns (uint256) {
        return 1;
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
