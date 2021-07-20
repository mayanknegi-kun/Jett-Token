const { assert } = require("chai");

const JettToken = artifacts.require("JettToken");

contract("JettToken",accounts=>{
    var contractInstance;

    before(async()=>{
         contractInstance = await JettToken.deployed()
    })

    it("Should deploy contract properly",()=>{
        // console.log(contractInstance.address);
        assert(contractInstance.address!=="");
    })

    it("Correct Name and Symbol",async ()=>{
        const name = await contractInstance.name();
        const symbol = await contractInstance.symbol();
        // console.log(name,symbol);
        assert.equal(name,"JettToken","name is not correct");
        assert.equal(symbol,"JET"),"symbol is not correct";
    })
    it("Correct initial TotalSupply",async()=>{
        const totalSupply = await contractInstance.totalSupply();
        assert(totalSupply.toNumber(),100000,"sets total supply to 10000");
    })
    it("transfer all the tokens to deployer",async()=>{
        const accountBalance = await contractInstance.balanceOf(accounts[0]);
        const totalSupply = await contractInstance.totalSupply();
        console.log(accountBalance)
        assert.equal(accountBalance.toNumber(),totalSupply.toNumber()) 
    })
})