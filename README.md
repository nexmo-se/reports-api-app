# Sample Application using Vonage Reports API

## Prerequisites

Install [Node.js](https://nodejs.org/) on your system, this application has been tested with Node.js version 18.19.<br>

If you would like to run this sample application on your local computer, you may use [ngrok](ngrok.com), create a [ngrok agent](https://ngrok.com/docs/getting-started/) to forward to local port 8000 (as this sample application listens on HTTP port 8000, secure https).

## Set up

Copy or rename _.env-example_ to _.env_ .<br>

Start ngrok, take note of the forwarding URL, e.g. https://xxxx.ngrok-free.dev or https://xxxx.ngrok.io as you will enter it in the next step (as **CALL_BACK_BASE_URL** in .env file).

Update parameters in .env file.<br>

Install node modules with the command "npm install".<br>

## Usage

Edit the program source file _reports.js_, update arguments of parameters in lines 4 to 14 for your desired report.<br>

Start application with the command "node reports".<br>

The report will be available in the folder _post-call-data_ as a zip file.

Exit the application and follow instructions here to generate a different report.

This application has been made simple to generate sample reports, you may enhance it to include a web-based UI or generate reports regularly at given times with a given type of report. 

## Documentation

Get more information [here](https://developer.vonage.com/en/api/reports).