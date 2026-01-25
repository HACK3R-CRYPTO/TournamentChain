// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    // Events
    event NumberSet(address indexed setter, uint256 oldNumber, uint256 newNumber);
    event NumberIncremented(address indexed incrementer, uint256 oldNumber, uint256 newNumber);

    function setNumber(uint256 newNumber) public {
        number = newNumber;
          emit NumberSet(msg.sender, oldNumber, newNumber);
    }

    function increment() public {
        number++;
          emit NumberIncremented(msg.sender, oldNumber, number);
    }
}
