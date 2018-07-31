const express = require('express');
const bodyParser = require('body-parser');
const Chatkit = require('@pusher/chatkit-server');
const [CHATKIT_INSTANCE_LOCATOR, SECRET_KEY] = require('./config');

const chatkit = new Chatkit.default({
  instanceLocator: CHATKIT_INSTANCE_LOCATOR,
  key: SECRET_KEY,
});

const app = express(); // (2)
app.use(bodyParser.json());


function createUser(chatkit, id, name, avatarURL, res) {
  chatkit.createUser({
    id, name, avatarURL
  })
    .then(() => {
      console.log('Create user successfully');
      res.status(200).send('Create user successfully');
    }).catch((err) => {
      console.log('Unable to create user');
      res.status(404).send('Unable to create user');
    });
}
app.post('/create/user', function (req, res) { // (5)
  const name = req.body.name;
  const id = req.body.id;
  const avatarURL = req.body.avatar;

  console.log(name);
  console.log(id);
  console.log(avatarURL);

  //check user exist
  chatkit.getUsers()
    .then((users) => {
      const user = users.filter(user => user.name == name);
      if (user.length == 0) {
        createUser(chatkit, id, name, avatarURL, res);
      } else {
        console.log('User exist');
        res.status(200).send('User exist');
      }
    }).catch((err) => {
      console.log('Cant get user from Chatkit');
      res.status(404).send('Cant get user from Chatkit');
    });
});

app.post('/check/user', function (req, res) {
  const name = req.body.name;
  const id = req.body.id;
  const avatarURL = req.body.avatar;

  //check user exist
  chatkit.getUsers()
    .then((users) => {
      const user = users.filter(user => user.name == name);
      if (user.length == 0) {
        console.log('User is not found');
        res.status(202).send('User is not found');
      } else {
        console.log('Check user exist');
        res.status(200).send('Check user exist');
      }
    }).catch((err) => {
      console.log('Cant get user from Chatkit');
      res.status(404).send('Cant get user from Chatkit');
    });
});

app.post('/get/user', function (req, res) {
  const name = req.body.name;
  //check user exist
  chatkit.getUsers()
    .then((users) => {
      const user = users.filter(user => user.name == name);
      if (user.length == 0) {
        console.log('User is not found');
        res.status(202).send('User is not found');
      } else {
        console.log('Check user exist');
        res.status(200).send(user);
      }
    }).catch((err) => {
      console.log('Cant get user from Chatkit');
      res.status(404).send('Cant get user from Chatkit');
    });
});

app.listen(4000, function () { // (6)
  console.log('App listening on port 4000');
});