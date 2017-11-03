'use strict';

var uuid = require('uuid');
var fetch = require('node-fetch');
var crypto = require('crypto');
var apiUrl = 'http://stagingapi.veriff.me';
var clientId = 'Add your key here';
var secret = 'Add your secret here';

var jwtPayload = function () {
  return {
    id: uuid.v4(),
    person: {
      firstName: 'Tundmatu',
      lastName: 'Toomas',
      idNumber: '48103122716'
    },
    document: {
      number: 'ASDFA22'
    },
    timestamp: new Date().toISOString(),
    additionalData: {
      email: 'officebot@veriff.me'
    },
    features: ['selfid', 'video_call']
  };
};

var createSession = function () {
  var payload = jwtPayload();

  var body = {
    verification: payload
  };

  var signature = crypto.createHash('sha256').update(new Buffer(`${JSON.stringify(body)}${secret}`, 'utf8')).digest('hex');
  fetch(apiUrl + '/v1/sessions/', {
    method: 'POST',
    headers: {
      'X-AUTH-CLIENT': clientId,
      'X-SIGNATURE': signature,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => {
    console.log('RAW response', response);
    return response.json()
  }).then(data => {
    console.log('JSON formatted response', data)
  }).catch(e => {
    console.log(e);
  });
}
module.exports = {
  createSession
};

