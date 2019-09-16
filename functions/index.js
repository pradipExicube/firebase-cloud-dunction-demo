
/* For Reference use ==>
https://dev.to/bogdaaamn/getting-started-with-google-cloud-functions-on-firebase-3g29
*/
'use strict';

const express = require('express');
const cors = require('cors');

// Firebase init
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Express and CORS middleware init
const app = express();
app.use(cors());

// POST / method
/* add Data using POST */
app.post("/add", (request, response) => {
    const entry = request.body;
    
    return admin.database().ref('/utsab_data').push(entry)
        .then((success) => {
            return admin.database().ref('/utsab_data/' + success.key+'/uid/').set(success.key)
            .then(()=>{
                let data={status:200,data:entry,success:success.key}
                return response.status(200).send(data)
            })
            .catch((error)=>{
                console.error(error);
                return response.status(500).send('UID addition error ' + error);
            })
            
        }).catch(error => {
            console.error(error);
            return response.status(500).send('Oh no! Error: ' + error);
        });
});


// GET / method
app.get("/fetchdata", (request, response) => {
    return admin.database().ref('/utsab_data').on("value", snapshot => {
        if(snapshot.val()){
            return response.status(200).send(snapshot.val());
        }else{
            return response.status(200).send("data not found");
        }
        
    }, error => {
        console.error(error);
        return response.status(500).send('Oh no! Error: ' + error);
    });
});

exports.utsab = functions.https.onRequest(app);