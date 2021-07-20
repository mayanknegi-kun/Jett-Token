const { assert } = require("chai");

const JettToken = artifacts.require("JettToken");

contract("JettToken",accounts=>{
    var contractInstance;

    before(async()=>{
         contractInstance = await JettToken.deployed()
    })

    describe("Address of the Contract",()=>{
        it("Should deploy contract properly",()=>{
            // console.log(contractInstance.address);
            assert(contractInstance.address!=="");
        })
    })
    
    describe("Identification of the contract",()=>{
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
    })

   describe("Initial Token Miniting and transfer",()=>{
    it("transfer all the tokens to deployer",async()=>{
        const accountBalance = await contractInstance.balanceOf(accounts[0]);
        const totalSupply = await contractInstance.totalSupply();
        // console.log(accountBalance.toNumber())
        assert.equal(accountBalance.toNumber(),totalSupply.toNumber()) 
    })
   }) 
    
    it("check for invalid transfer amount",()=>{
        contractInstance.transfer.call(accounts[1],9999999)
        .then(assert.fail).catch(error=>{
            assert(error.message,"function must contain revert");
        })
    })
    it("valid transfer",async()=>{
        contractInstance.transfer.call(accounts[1],1000,{from:accounts[0]})
        .then(receipt=>{
            assert.equal(receipt.logs.length,1,"Only one event should emit.");
            assert.equal(receipt.logs[0].event,"Transfer","Should be a transfer event.")
            return contractInstance.balanceOf(accounts[1])
        }).then(balance=>{
            assert.equal(balance.toNumber(),1000,"add the correct amount to reciever")
            var balSender = contractInstance.balanceOf(accounts[0])
            assert.equal(balSender.toNumber(),9000,"correct balance of the sender")
        })
    })
    
    
})