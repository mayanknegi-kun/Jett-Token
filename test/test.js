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
        // console.log(accountBalance.toNumber())
        assert.equal(accountBalance.toNumber(),totalSupply.toNumber()) 
    })
    it("check for invalid transfer amount",()=>{
        contractInstance.transfer.call(accounts[1],9999999)
        .then(assert.fail).catch(error=>{
            assert(error.message,"function must contain revert");
        })
    })
    it("valid transfer",()=>{
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
    it("Approval for Delegate Transfer",()=>{
        contractInstance.approve.call(accounts[1],100)
        .then(success=>{
            assert.equal(success,true);
        })
        contractInstance.approve(accounts[1],100)
        .then(receipt=>{
            assert.equal(receipt.logs.length,1,"triggers one event");
            assert.equal(receipt.logs[0].event,"Approval","Should be Approval Event");
            assert.equal(receipt.logs[0].args._owner,accounts[0],"logs the account the token are authorised by");
            assert.equal(receipt.logs[0].args._spender,accounts[1],"logs the account the token are authorised to");
            assert.equal(receipt.logs[0].args._value,100,"logs the transfer amount");
        })
    })

})