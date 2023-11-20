// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {RandomNumbers} from "../src/Utils/RandomNumbers.sol";
import {console} from "forge-std/Test.sol";

contract RandomNumbersSetUp is Script {

    // the following command needs to be executed to properly set the parameters in your contract on chain:
    // npx @api3/airnode-admin derive-sponsor-wallet-address \
    // --airnode-address 0x6238772544f029ecaBfDED4300f13A3c4FE84E1D \
    // --airnode-xpub xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo \
    // --sponsor-address address of your contract!!!>
    
    RandomNumbers public constant randomNumbers = RandomNumbers(payable(0xE0Be7fE3Bab804B5F4CA9308C996C16569Df62D0));

    function run() external {

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        _finishSetUp();

        vm.stopBroadcast();
    }

    function _finishSetUp() internal {

        // randomNumbers.transfer(msg.value);

        randomNumbers.setRequestParameters(
                        address(0x6238772544f029ecaBfDED4300f13A3c4FE84E1D), 
                        bytes32(0x94555f83f1addda23fdaa7c74f27ce2b764ed5cc430c66f5ff1bcf39d583da36), 
                        bytes32(0x9877ec98695c139310480b4323b9d474d48ec4595560348a2341218670f7fbc2), 
                        address(0xfb0c821438ea15e95ab6edDd20043aE761def741),  // derived address from avobe CLI command
                        address(0x9Baca60f3Bd0A5376631cf4Bf9b5A807B99A10B0)); //use CHEST address
    }
}
