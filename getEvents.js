const axios = require('axios');
const db = require('./helpers/db.js').db;
const async = require("async");

getConsensusEvents()

function getConsensusEvents() {
  axios.get('http://18.191.184.199:8000/consensusevents/')
  .then((response) => {
    async.mapLimit(response, 10, (event, callback) => {insertConsensusEvent(event, callback)}, function(err, results) {
      setTimeout(getConsensusEvents, 500)
    });
  })
  .catch((error) => {
    console.log(error);
  });
}

function insertConsensusEvent(event, callback) {
  db.none('insert into consensus_events (hash) select ($1) where NOT EXISTS (SELECT hash FROM consensus_events WHERE hash = $1);', [
    event
  ])
  .then(() => {
    callback(null, true)
  })
  .catch((err) => {
    console.log(err)
    callback(err, null)
  })
}
