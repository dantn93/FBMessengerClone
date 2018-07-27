const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
const Chatkit = require('@pusher/chatkit-server');
const [CHATKIT_INSTANCE_LOCATOR, SECRET_KEY] = require('./config');

const pusherConfig = require('./pusher.json'); // (1)
const pusherClient = new Pusher(pusherConfig);

const app = express(); // (2)
app.use(bodyParser.json());

app.post('/create/user', function(req, res) { // (5)
    const name = req.body.name;
    const id = req.body.id;

    const chatkit = new Chatkit.default({
        instanceLocator: CHATKIT_INSTANCE_LOCATOR,
        key: SECRET_KEY,
    })

    chatkit.createUser({
        id, name
    })
    .then(() => {
        console.log('Create user successfully');
        res.sendStatus(204);
    }).catch((err) => {
        console.log('Unable to create user');
        res.sendStatus(404);
    });
});

app.listen(4000, function() { // (6)
    console.log('App listening on port 4000');
});