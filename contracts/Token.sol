//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


// An ERC-20 token for testing purposes
// Based on the OpenZeppelin ERC-20 contract, but with a faucet function

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";




contract OrisUselessToken is ERC20 {

    // The only address allowed to specify the CalldataInterpreter address
    address owner;

    // The CalldataInterpreter address
    address proxy = address(0);  

    /**
     * @dev Calls the ERC20 constructor. 
     */
    constructor(
    ) ERC20("Oris useless token", "OUT") {
        owner = msg.sender;
    }

    /**
     * @dev set the address for the proxy (the CalldataInterpreter). 
     * Can only be called once by the owner
     */
    function setProxy(address _proxy) external {
        require(msg.sender == owner, "Can only be called by owner");
        require(proxy == address(0), "Proxy is already set");

        proxy = _proxy;        
    }    // function setProxy


    /**
     * @dev Some functions may only be called by the proxy.
     */
    modifier onlyProxy {
      require(msg.sender == proxy);
      _;
    }
     

    /**
     * @dev Gives the caller 1000 tokens to play with
     */
    function faucet() external {
        _mint(msg.sender, 1000);
    }   // function faucet

    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }   // function decimals


    /* Functions that allow the proxy to actually proxy for accounts */

    function transferProxy(address from, address to, uint256 amount) 
        public virtual onlyProxy() returns (bool) 
    {
        _transfer(from, to, amount);
        return true;
    }

    function approveProxy(address from, address spender, uint256 amount) 
        public virtual onlyProxy() returns (bool) 
    {
        _approve(from, spender, amount);
        return true;
    }

    function transferFromProxy(
        address spender,
        address from,
        address to,
        uint256 amount
    ) public virtual onlyProxy() returns (bool) 
    {
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }


}       // contract OrisUselessToken