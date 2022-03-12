const { expect } = require("chai");

describe("CalldataInterpreter", function () {
  it("Should let us use tokens", async function () {
    const Token = await ethers.getContractFactory("OrisUselessToken")
    const token = await Token.deploy()
    await token.deployed()
    console.log("Token addr:", token.address)
    
    const Cdi = await ethers.getContractFactory("CalldataInterpreter")
    const cdi = await Cdi.deploy(token.address)
    await cdi.deployed()
    await token.setProxy(cdi.address)
    console.log("CalldataInterpreter addr:", cdi.address)

    // Need two signers to verify allowances
    const signers = await ethers.getSigners()
    const signer = signers[0]
    const poorSigner = signers[1]

    // Get tokens to play with
    const faucetTx = {
      to: cdi.address,
      data: "0x01"
    }
    await (await signer.sendTransaction(faucetTx)).wait()

    // Check the faucet provides the tokens correctly
    expect (await token.balanceOf(signer.address)).to.equal(1000)
      
    // Transfer tokens
    const destAddr = "0xf5a6ead936fb47f342bb63e676479bddf26ebe1d"
    const transferTx = {
      to: cdi.address,
      data: "0x02" + destAddr.slice(2,42) + "0100"
    }
    await (await signer.sendTransaction(transferTx)).wait()

    // Check that we have 256 tokens less
    expect (await token.balanceOf(signer.address)).to.equal(1000-256)    

    // And that our destination got them
    expect (await token.balanceOf(destAddr)).to.equal(256)        

    // approval and transferFrom
    const approveTx = {
      to: cdi.address,
      data: "0x03" + poorSigner.address.slice(2,42) + "00FF"
    }
    await (await signer.sendTransaction(approveTx)).wait()
    

    const destAddr2 = "0xE1165C689C0c3e9642cA7606F5287e708d846206"

    const transferFromTx = {
      to: cdi.address,
      data: "0x04" + signer.address.slice(2,42) + destAddr2.slice(2,42) + "00FF"
    }
    await (await poorSigner.sendTransaction(transferFromTx)).wait()    

    // Check the approve / transeferFrom combo was done correctly
    expect (await token.balanceOf(destAddr2)).to.equal(255)    
    
  })    // it
})      // describe