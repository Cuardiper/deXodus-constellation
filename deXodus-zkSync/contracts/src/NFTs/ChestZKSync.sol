// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EXD} from "../EXD.sol";
import {Guardians} from "./Guardians.sol";

contract ChestZKSync is ERC1155, Ownable {
    EXD public exd;
    ERC20Upgradeable public usdc;
    uint256 public chestPrice;
    uint256 public openSpend;
    uint256 public nonce;
    Guardians public guardians;

    constructor(uint256 _price, uint256 _spend, address _exd, address _usdc, address _guardians,string memory _baseURI) ERC1155(_baseURI) {
        exd = EXD(_exd);
        chestPrice = _price;
        openSpend = _spend;
        usdc = ERC20Upgradeable(_usdc);
        guardians = Guardians(_guardians);
    }

    function buyChest() public {
        usdc.transferFrom(msg.sender, address(this), chestPrice);
        _mint(msg.sender, 1, 1, "");
    }

    function openChest() public {
        exd.transferFrom(msg.sender, address(this), chestPrice);  
        _burn(msg.sender, 1, 1);
        _getguardiansIds();
    }

    function _getguardiansIds() internal returns (uint256[] memory) {

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1;
        amounts[1] = 1;
        amounts[2] = 1;

        uint256[] memory ids = new uint256[](3);
        ids = _randomNumbers(3);

        guardians.mintBatch(msg.sender, ids, amounts);
    }

    function _randomNumbers(uint256 quantity) internal returns (uint256[] memory) {
        uint256 _nonce = nonce;

        uint256[] memory randomNumbers = new uint256[](3);

        for (uint256 i; i < quantity; i++){
            randomNumbers[i] = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nonce))) % 200;
            _nonce++;
        }

        nonce = _nonce;
    }

}