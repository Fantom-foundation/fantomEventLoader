const axios = require('axios');
const db = require('./helpers/db.js').db;
const async = require("async");

getLatestSavedBlock()

var track = 0

function getBlockById(id) {
  axios.get('http://18.216.137.183:8080/blockById/'+id)
  .then((response) => {
    insertBlock(response.data)
    console.log(response)
    response.data.transactions.map((t) => {insertTransaction(t,response.data.hash)})
  })
  .catch((err) => {
    console.log(err.response.data)
    if (err.response.data == 'leveldb: not found\n') {
      track++
      if (track >= 3) {
        track = 0;
        setTimeout(function() {getBlockById(++id)}, 2000)
      } else {
        setTimeout(function() {getBlockById(id)}, 2000)
      }
    } else {
      console.log(err)
    }
  })
}

function getLatestSavedBlock() {
  db.oneOrNone('select coalesce(max(index),-1)+1 as latest_saved_block from blocks;')
  .then((block) => {
    getBlockById(block.latest_saved_block)
  })
  .catch((error) => {
    console.log(error)
  })
}

function insertBlock(block) {
  db.none('insert into blocks (hash, index, round, payload) values ($1, $2, $3, $4);', [
    block.hash, block.index, block.round, block
  ])
  .then(() => {
    getBlockById(block.index+1)
  })
  .catch((err) => {
    console.log(err)
  })
}
function insertTransaction(t, hash) {
  db.none('insert into transactions (hash, root, "from", "to", value, gas, used, price, cumulative, contract, logs, error, failed, status, block) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);', [
    t.transactionHash, t.root, t.from, t.to, t.value, t.gas, t.gasUsed, t.gasPrice, t.cumulativeGasUsed, t.contractAddress, t.logsBloom, t.error, t.failed, t.status, hash
  ])
  .then(() => {
  })
  .catch((err) => {
    console.log(err)
  })
}
