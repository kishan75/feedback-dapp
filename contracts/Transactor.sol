// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./BHUToken.sol";

contract Transactor {
    // Contract constants  
    string public contractName = "Transactor";
    address public contractAddress = address(this); 
    address public contractOwner;
    BHUToken public bhuToken;
    
    // Ticket variables
    uint public ticketValue = 5e18;
    string[] public tickets;
    mapping(string => bool) public ticketSet;

    // Feedback variables
    uint public feedbackCost = 1e18;
    mapping(address => string) public feedbackMap;
    
    constructor(address _bhuToken) {
        contractOwner = msg.sender;
        bhuToken = BHUToken(_bhuToken);
    }

    // Check balance
    function checkBalance(address _address) public view returns(uint) {
        return bhuToken.balanceOf(_address);
    }

    // Set tickets
    function setTickets(string[] memory _tickets) public {
        // Only owner can call this function
        require(msg.sender == contractOwner, "Only the owner can set tickets");

        for(uint i=0; i<tickets.length; i++)
            ticketSet[tickets[i]] = false;
        tickets = _tickets;
        for(uint i=0; i<tickets.length; i++)
            ticketSet[tickets[i]] = true;
    }

    // Redeem tokens from ticket
    function redeemTokens(string memory _ticket) public {
        require(ticketSet[_ticket] == true, "Invalid ticket");

        ticketSet[_ticket] = false;
        bhuToken.transfer(msg.sender, ticketValue);
    }

    // Write feedback 
    function submitFeedback(string memory _review) public {
        require(checkBalance(msg.sender) >= 1, "Insufficent tokens");

        feedbackMap[msg.sender] = _review;
        bhuToken.transferFrom(msg.sender, contractAddress, feedbackCost);
    }
}