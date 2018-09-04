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
				var data = res.map(user => ({ id: user.id, name: user.name }));
				fn(null, { success: true, data });
			}).catch((err) => {
				fn(null, { success: false, status: err.message })
			});
		return fn.promise;
	}

	Chat.addmessages = function (params, fn) {
		fn = fn || utils.createPromiseCallback();
		const { roomid, message } = params;
		var messObj = JSON.parse(message);
		// var messObj = message;
		Chat.find({ where: { roomid } }, function (err, obj) {
			if (err == null) {
				if (obj.length > 0) {
					//update
					const old_messages = obj[0].messages;
					// console.log(old_messages);
					// console.log(messObj);
					var new_messages = [...old_messages, messObj];
					obj[0].updateAttributes({ messages: new_messages }, function (err, obj) {
						console.log(obj);
					})
				}
				if (obj.length == 0) {
					//create
					Chat.create({ roomid, messages: [messObj] }, function (err, obj) {
						fn(err, obj);
					})
				}
			} else {
				fn(err, null);
			}
		});

		return fn.promise;
	}


	Chat.translate = function (params, fn) {
		fn = fn || utils.createPromiseCallback();
		const rawMessage = params.rawMessage;
		const toLanguage = params.toLanguage;
		const fromLanguage = params.fromLanguage;

		if (rawMessage != '' && toLanguage != '') {
			translate(rawMessage, { to: toLanguage })
				.then(restext => {
					fn(null, { success: true, data: restext.text });
				}).catch(err => {
					fn(null, { success: false, status: 'Cant translate' });
				});
		}
		else {
			fn(null, { success: false, status: 'rawMessage or language is a empty string' });
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

		ChatModel.remoteMethod(
			'addmessages',
			{
				description: 'Add and update messages',
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