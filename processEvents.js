const axios = require('axios');
const db = require('./helpers/db.js').db;
const async = require("async");

getConsensusEvents()

function getConsensusEvents() {
  db.manyOrNone('select * from consensus_events where processed is not true;')
  .then((response) => {
    async.mapLimit(response, 10, (event, callback) => {getEvent(event, callback)}, function(err, results) {
      setTimeout(getConsensusEvents, 500)
    });
  })
  .catch((error) => {
    console.log(error);
  });
}

function getEvent(event, callback) {
  axios.get('http://18.191.184.199:8000/event/'+event.hash)
  .then((response) => {
    insertConsensusEventData(event.hash, response.data, callback)
  })
  .catch((error) => {
    console.log(error);
    callback(error, null)
  });
}

function insertConsensusEventData(event, eventData, callback) {
  db.none('insert into consensus_events_data (hash, payload, index, event_time) values ($1, $2, $3, $4);', [
    event, eventData, eventData.Body.Index, eventData.Body.Timestamp
  ])
  .then(() => {
    updateConsensusEvent(event, callback)
  })
  .catch((err) => {
    console.log(err)
    callback(error, null)
  })
}

function updateConsensusEvent(event, callback) {
  db.none('update consensus_events set processed = true where hash = $1', [
    event
  ])
  .then(() => {
    callback(null, true)
  })
  .catch((err) => {
    console.log(err)
    callback(error, null)
  })
}
