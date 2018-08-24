const axios = require('axios');
const db = require('./helpers/db.js').db;
const async = require("async");

getLatestRound()

function getLatestRound() {
  axios.get('http://18.191.184.199:8000/stats')
  .then(function (response) {
    getLatestSavedRound(response.data.last_consensus_round)
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getLatestSavedRound(latestRound) {
  db.oneOrNone('select max(round_number)+1 as latest_saved_round from rounds;')
  .then((round) => {
    getNewRounds(round.latest_saved_round, latestRound)
  })
  .catch((error) => {
    console.log(error)
  })
}

function getNewRounds(latestSavedRound, latestRound) {
  if(typeof latestSavedRound == 'undefined' || latestSavedRound == null) {
    latestSavedRound = 0
  }
  if (latestSavedRound == latestRound) {
    setTimeout(getLatestRound, 1000)
  } else {
    var rounds = []
    for(var i = latestSavedRound; i < latestRound;  i++) {
      rounds.push(i)
    }
    async.mapLimit(rounds, 10, (round, callback) => {getRound(round, callback)}, function(err, results) {
      setTimeout(getLatestRound, 500)
    });
  }
  
}

function getRound(index, callback) {
  axios.get('http://18.191.184.199:8000/round/'+index)
  .then((response) => {
    insertRound(index, response.data, callback)
  })
  .catch((error) => {
    console.log(error);
    callback(error, false)
  });
}

function insertRound(index, round, callback) {
  db.none('insert into rounds (round_number, payload) values ($1, $2);', [
    index, round
  ])
  .then(() => {
    callback(null, true)
  })
  .catch((err) => {
    console.log(err)
    callback(error, false)
  })
}
