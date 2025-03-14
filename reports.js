'use strict'

//---- Sample dates interval ----
const startDate = "2025-03-13T00:00:00+00:00";  // UTC
const endDate = "2025-03-14T00:00:00+00:00";  // UTC

//--- Sample report file name ---
const reportFile = "./post-call-data/report01.zip";

//--- Type of CDRs to retrieve ---
//-- see https://developer.vonage.com/en/api/reports#create-async-report-req-body --
//-- uncomment desired type, comment other types
const eventType = "VOICE-CALL"; // successful calls
// const eventType = "VOICE-FAILED"; // successful calls

//==========================================================

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const request = require('request');
const fs = require('fs');
app.use(bodyParser.json());

//------------------------------

// You must use api.nexmo.com and not api.vonage.com otherwise you get an error '403 Forbidden'
const apiBaseUrl = "https://api.nexmo.com";

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const callBackBaseUrl = process.env.CALL_BACK_BASE_URL;

const authorizationValue = Buffer.from(apiKey + ":" + apiSecret).toString('base64');

//==========================================================

//--- Downlaod file from file URL function ---

const download = (url, dest, callback) => {
  
  const file = fs.createWriteStream(dest);
  
  const req = request.get(
    url, 
    {
      headers: {
          'Authorization': 'Basic ' + authorizationValue,
          "content-type": "application/json",
      }
    });

  req.on('response', (response) => {
    if (response.statusCode !== 200) {
      return callback(`Response status was ${response.statusCode}`);
    }

    req.pipe(file);
  });

  file.on('finish', () => {
    file.close(callback);
  });

  req.on('error', (err) => {
    fs.unlink(dest, () => callback(err));
  });

  file.on('error', (err) => {
    fs.unlink(dest, () => callback(err));
  });
};

//--------

request.post(apiBaseUrl + '/v2/reports', {
    headers: {
        'Authorization': 'Basic ' + authorizationValue,
        "content-type": "application/json",
    },
    body: {
      "product": eventType,
      "account_id": apiKey,
      "date_start": startDate,
      "date_end": endDate,
      "callback_url": callBackBaseUrl + "/reports",
      "direction": "outbound"
    },
    json: true,
  }, function (error, response, body) {
    if (error) {
      console.log('reports error:', error.body);
    }
    else {
      console.log('reports request status:', response.body);
    }
});

//-------------------

app.post('/reports', async(req, res) => {

  res.status(200).send('Ok');

  console.log(">>> reports results:", req.body);

  const reportsLink = req.body._links.download_report.href;
  console.log(">>> Reports link:", reportsLink);

  // await vonageNr.voice.downloadRecording(reportsLink, './post-call-data/' + 'report5.zip');
  download(reportsLink, reportFile, (err) => {
    if (err) {
      console.error('Error downloading report file', err);
    } else {
      console.log('Report file', reportFile, 'with event type', eventType, 'successfully downloaded!');
    }
  });

});

//=========================================

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Application listening on port ${port}`));

//------------
