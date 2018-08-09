'use strict';
var utils = require('loopback/lib/utils');
const Chatkit = require('@pusher/chatkit-server');
const [CHATKIT_INSTANCE_LOCATOR, SECRET_KEY] = require('../configs/chatkit');
const translate = require('google-translate-api');
const chatkit = new Chatkit.default({
    instanceLocator: CHATKIT_INSTANCE_LOCATOR,
    key: SECRET_KEY,
})

function filteruser(fn, id, name) {
    chatkit.getUsers()
        .then((users) => {
            const user = users.filter(user => user.id == id);
            if (user.length == 0) {
                //dont have user, then create him
                chatkit.createUser({
                    id, name
                })
                    .then(() => {
                        fn(null, { success: true, status: "Create user successfully" });
            
                    }).catch((err) => {
                        fn(null, { success: false, status: "Cant create user" });
                    });
            } else { //user exist
                fn(null, { success: true, status: 'User exists' })
            }
        }).catch((err) => {
            fn(null, { success: false, status: "Can not get users" })
        });
}


module.exports = function (Chat) {
    Chat.createuser = function (params, fn) {
        fn = fn || utils.createPromiseCallback();
        const { name, id } = params;
        filteruser(fn, id, name);
        return fn.promise;
    }

    Chat.getlistusers = function (fn) {
        fn = fn || utils.createPromiseCallback();
        chatkit.getUsers()
        .then((res) => {
            var data = res.map(user => ({id: user.id, name: user.name}));
            fn(null, {success: true, data});
        }).catch((err) => {
            fn(null, {success: false, status: err.message})
        });
        return fn.promise;
    }

    Chat.translate = function (params, fn) {
        fn = fn || utils.createPromiseCallback();
        console.log(params);
        // const { name, id } = params;
        const rawMessage = params.rawMessage;
        const toLanguage = params.toLanguage;
        const fromLanguage = params.fromLanguage;
        console.log('//== TRANSLATION ==//')
        console.log('RawMessage: ',rawMessage);
        console.log('From: ', fromLanguage);
        console.log('To: ', toLanguage);
        
        if(rawMessage != '' && fromLanguage != '' && toLanguage != ''){
            translate(rawMessage, {from: fromLanguage, to: toLanguage})
            .then(restext => {
              console.log('TranslatedMessage: ', restext.text);
              console.log('//== END ==//')
              fn(null, {success: true, data: restext.text});
            }).catch(err => {
                fn(null, {success: false, status: 'Cant translate'});
            });
          }else{
            fn(null, {success: false, status: 'rawMessage or language is a empty string'});
          }

        return fn.promise;
    }

    Chat.setup = function () {
        Chat.base.setup.call(this);
        var ChatModel = this;
        ChatModel.remoteMethod(
            'createuser',
            {
                description: 'Create new user with chatkit',
                accepts: [
                    { arg: 'params', type: 'object', required: true, http: { source: 'body' } },
                    {
                        arg: 'include', type: ['string'], http: { source: 'query' },
                        description: 'Related objects to include in the response. ' +
                            'See the description of return value for more details.'
                    },
                ],
                returns: {
                    arg: 'data', type: 'object', root: true,
                    description: ''

                },
                http: { verb: 'post' },
            }
        );

        ChatModel.remoteMethod(
            'getlistusers',
            {
                description: 'Get list user from chatkit',
                returns: {
                    arg: 'data', type: 'object', root: true,
                    description: ''

                },
                http: { verb: 'post' },
            }
        );

        ChatModel.remoteMethod(
            'translate',
            {
                description: 'Create new user with chatkit',
                accepts: [
                    { arg: 'params', type: 'object', required: true, http: { source: 'body' } },
                    {
                        arg: 'include', type: ['string'], http: { source: 'query' },
                        description: 'Related objects to include in the response. ' +
                            'See the description of return value for more details.'
                    },
                ],
                returns: {
                    arg: 'data', type: 'object', root: true,
                    description: ''

                },
                http: { verb: 'post' },
            }
        );
        return ChatModel;
    }
    Chat.setup();
};