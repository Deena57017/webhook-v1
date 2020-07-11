const express = require('express');
const app = express();
const request = require('request')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 4000;
// Import the appropriate class
const ACCESS_TOKEN = 'wFkbM2s/yZ1omg++gj+3C/IyFup1n7e7fGG5wAHGxzrxtRWkOgERzmkiEUrlLeuOBk0reNrHWgsfEw8H8jJEt0/1XubDvHQAsIlehGtBQN1n6V0Crc8k/HCxyMI9FTB1IXwtlhK2wz85FAu6Ba+OvQdB04t89/1O/w1cDnyilFU='
const { WebhookClient } = require('dialogflow-fulfillment');

app.use(morgan('dev'))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send({
        success: true
    });
})

app.post('/webhook', (req, res) => {
    console.log('POST: /');
    // console.log('Body: ', req.body);
//Create an instance
    const agent = new WebhookClient({
        request: req,
        response: res
    });
//Test get value of WebhookClient
//     console.log('agentVersion: ' + agent.agentVersion);
//     console.log('intent: ' + agent.intent);
//     console.log('locale: ' + agent.locale);
//     console.log('query: ', agent.query);
//     console.log('session: ', agent.session);
//Function Location
    function randomNumber(agent) {
        let startNumber = req.body.queryResult.parameters.startNumber
        let endNumber = req.body.queryResult.parameters.endNumber

        let result = parseInt(Math.random() * (endNumber - startNumber) + startNumber);

        agent.add(Random number between ${startNumber} and ${endNumber} is ${result});
    }

    function findLocation(agent) {
        console.log(agent)
    }
// Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Number', randomNumber);  // "Location" is once Intent Name of Dialogflow Agent
    intentMap.set('Location', findLocation);
    agent.handleRequest(intentMap);
});

app.post('/line/webhook', (req, res) => {
    let text = req.body.events[0].message.text || ''
    let sender = req.body.events[0].source.userId || ''
    let replyToken = req.body.events[0].replyToken || ''
    const latitude = req.body.events[0].message.latitude
    const address = req.body.events[0].message.address
    const longitude = req.body.events[0].message.longitude



    console.log(address, latitude, longitude)
    // console.log(req.body.events[0].message.latitude)
    // console.log(text, sender, replyToken)
    // console.log(typeof sender, typeof text)
    // console.log(req.body.events[0])
    if (text === 'สวัสดี' || text === 'Hello' || text === 'hello') {
        sendText(sender, text)
    } else {
        sendLocation(sender, address, latitude, longitude)
    }
    res.sendStatus(200)
})

function sendText (sender, text) {
    let data = {
        to: sender,
        messages: [
            {
                type: 'text',
                text: 'สวัสดีค่ะ บ้านราคาดี.com ยินดีให้บริการคะ 💞'
            }
        ]
    }
    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer ${ACCESS_TOKEN}
        },
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        body: data,
        json: true
    }, function (err, res, body) {
        if (err) console.log('error')
        if (res) console.log('success')
        if (body) console.log(body)
    })
}

function sendLocation (sender, address, latitude, longitude) {
    let data = {
        to: sender,
        messages: [
            {
                type: 'text',
                text: สวัสดีค่ะ ที่อยู่ของคุณคือ ${address} ละติจูดที่ ${latitude} ลองจิจูดที่ ${longitude}💞
            }
        ]
    }
    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer ${ACCESS_TOKEN}
        },
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        body: data,
        json: true
    }, function (err, res, body) {
        if (err) console.log('error')
        if (res) console.log('success')
        if (body) console.log(body)
    })
}

app.listen(port, () => {
    console.log(Server is running at port: ${port});
});