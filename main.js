const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index, timestamp, data, previousHash = ''){
    // the index of our block
    this.index = index;
    // a timestamp of when it was created
    this.timestamp = timestamp;
    // the data of the block
    // this changes based on type of blockchain, for instance
    // a cryptocurrency will hold buyer/seller/amount information
    this.data = data;
    // this is the hash of the previous block in the chain
    // this maintains the integrity of our blockchain
    this.previousHash = previousHash;
    // this is the hash of the current block, set by the calculateHash function
    this.hash = this.calculateHash();
    // value that allows us to utilize mineBlock(), usually random
    this.nonce = 0;
  }

  calculateHash(){
    // take properties of the block and run it through a hash
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  // proof of work implementation
  // difficulty indicates how long it will take to mine a block
  // for instance, bitcoin makes it so that your hash has to begin with a certain amount
  // of 0s in order to be considered a valid block.
  // since the hash cannot be influenced due to cryptography, it usually takes about 10 minutes
  // to add a new block
  mineBlock(difficulty){
    // this line will continue to hash a block until the first difficulty characters
    /// of our hash is all 0s. Just recalulating our hash over and over will just
    // keep giving us the same hash, because none of the data will be changing
    // blockchains solve this with something called a nonce
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined ' + this.hash);
  }
}

class Blockchain{
  constructor(){
    // array of blocks
    this.chain = [this.createGenesisBlock()];
    // mineBlock difficulty setting
    this.difficulty = 5;
  }

  createGenesisBlock(){
    // the genesis block is the original block in the chain
    // this makes it unique and therefore must be manually created
    // We're passing it in some generic values
    return new Block(0, "09/18/2018", "Genesis Block", 0);
  }

  getLatestBlock(){
    // return the last block that was added
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    // first we set the block to point to our previous block's hash
    newBlock.previousHash = this.getLatestBlock().hash;
    // because the data in the hash changed, we have to recalculate the hash with the new properties
    // newBlock.hash = newBlock.calculateHash(); // this does not utilize mineBlock()
    newBlock.mineBlock(this.difficulty);
    // after the hash is calculated, we push it the the end of the chain
    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      // get the current block and the previous block
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1]

      if(currentBlock.hash !== currentBlock.calculateHash()){
        // if our current blocks hash is not equal to what we would get with recalculating
        // the hash, our block is invalid
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash){
        // if our current block does not point to our previous block the chain is invalid
        return false;
      }
    }
    return true;
  }
}

let testCoin = new Blockchain();
console.log('mining block 1......');
testCoin.addBlock(new Block(1, "09/19/2018", { amount: 4, sender: "Jesse", receiver: "Yan" } ));
console.log('mining block 2......');
testCoin.addBlock(new Block(2, "09/20/2018", { amount: 10, sender: "Yan", receiver: "Jesse" } ));
console.log('mining block 3......');
testCoin.addBlock(new Block(3, "09/30/2018", { amount: 100, sender: "Justin", receiver: "AOL" } ));


// console.log('Is chain valid? ' + testCoin.isChainValid());
//
// // now lets try messing with our chain
// // now lets try to rehash and see if we can fix the error of it being invalid
// testCoin.chain[1].data = { amount: 100, sender: "Jesse", receiver: "Yan" };
// testCoin.chain[1].hash = testCoin.chain[1].calculateHash();
// // in the case of invalid blocks, you should have a mechanism that rolls back the changes
// console.log('Is chain valid? ' + testCoin.isChainValid());


// console.log(JSON.stringify(testCoin, null, 4))
