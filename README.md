---
owner: "Client Tools"
description: "Demo for integrating with Veriff's API directly"
status: "production"
type: "documentation"
---

## Veriff's JS integration demo  
# Intro:  
This is a barebones example on how to integrate Veriff's API in a headless mode that skips our frontend application.  
It currently does five things for you:
1. Starts a verification session with Veriff.  
2. Uploads three images and attaches those to the verification session.  
3. Ends the verification session.
4. Does a media query for the verification session and receives the media that was uploaded during the second step.
5. Optionally, it also receives a decision notification webhook from Veriff of the final decision, which usually shouldn't take longer than few minutes.

# Installation:  
`npm install`  

# Run:  
Get 'Api key' and 'Api secret' (under Management -> Vendor) and respectively fill in API_TOKEN and API_SECRET environment variables.  

`API_TOKEN={_API_TOKEN} API_SECRET={API_SECRET} node app.js`  

Optionally, for receiving decision notifications for testing purposes, update 'Web hook url' (under Management -> Vendor -> Edit), and then include a WEBHOOK_PORT={PORT} argument that will boot up an Express.js webserver, and opens an endpoint that starts listening to the decision notification webhook for you (assuming your service has a public IP and domain and is open to the internet).  
