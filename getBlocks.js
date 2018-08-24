const axios = require('axios');
const db = require('./helpers/db.js').db;
const async = require("async");

getLatestBlock()

function getLatestBlock() {
  axios.get('http://18.191.184.199:8000/stats')
  .then(function (response) {
    getLatestSavedBlock(response.data.last_block_index)
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getLatestSavedBlock(latestBlock) {
  db.oneOrNone('select max(block_number)+1 as latest_saved_block from blocks;')
  .then((block) => {
    getNewBlocks(block.latest_saved_block, latestBlock)
  })
  .catch((error) => {
    console.log(error)
  })
}

function getNewBlocks(latestSavedBlock, latestBlock) {
  if(typeof latestSavedBlock == 'undefined' || latestSavedBlock == null) {
    latestSavedBlock = 0
  }
  if (latestSavedBlock == latestBlock) {
    setTimeout(getLatestBlock, 1000)
  } else {
    var blocks = []
    for(var i = latestSavedBlock; i < latestBlock;  i++) {
      blocks.push(i)
    }
    async.map(blocks, (block, callback) => {getBlock(block, callback)}, function(err, results) {
      setTimeout(getLatestBlock, 500)
    });
  }
}

function getBlock(index, callback) {
  axios.get('http://18.191.184.199:8000/block/'+index)
  .then((response) => {
    insertBlock(response.data, callback)
  })
  .catch((error) => {
    console.log(error);
    callback(err, null)
  });
}

function insertBlock(block, callback) {
  db.none('insert into blocks (block_number, payload) values ($1, $2);', [
    block.Body.Index, block
  ])
  .then(() => {
    callback(null, true)
  })
  .catch((err) => {
    console.log(err)
    callback(err, null)
  })
}
