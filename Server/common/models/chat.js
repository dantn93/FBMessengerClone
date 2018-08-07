'use strict';
var utils = require('loopback/lib/utils');
const Chatkit = require('@pusher/chatkit-server');
const [CHATKIT_INSTANCE_LOCATOR, SECRET_KEY] = require('../configs/chatkit');

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
        return ChatModel;
    }
    Chat.setup();
};