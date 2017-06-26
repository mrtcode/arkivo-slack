'use strict';

// Load Arkivo default config.
// It can be overridden by creating './config/default.json'
// file in the plugin's directory.
var config = require('arkivo/lib/config');

// This plugin uses Incoming WebHooks to post messages to Slack channels.
var IncomingWebhook = require('@slack/client').IncomingWebhook;

/**
 * Arkivo Slack plugin.
 *
 * @class Slack
 * @constructor
 */
var Slack = function (options) {
	// Add plugin defaults to the 'options' object.
	this.options = Object.assign({}, Slack.defaults);
	
	// Extend the 'options' object with the Arkivo config (from ./config/default.json).
	if (config.has('slack')) {
		Object.assign(this.options, config.get('slack'));
	}
	
	// Extend the 'options' object with subscription specific
	// parameters passed to this plugin instance.
	Object.assign(this.options, options);
	
	// Initialize WebHook that points to a specific Slack channel.
	this.webhook = new IncomingWebhook(this.options.webhookUrl);
};

/**
 * Plugin's default configuration.
 *
 * @property defaults
 * @type Object
 * @static
 */
Slack.defaults = {
	botName: "Zotero",
	botIconUrl: "https://www.zotero.org/support/_media/logo/zotero_48x48x32.png"
};

/**
 * Send a message to Slack.
 *
 * @method send
 *
 * @param text
 * @return {Promise.<void>}
 */
Slack.prototype.send = function (text) {
	var slack = this;
	// Customize message appearance.
	var data = {
		username: this.options.botName,
		iconUrl: this.options.botIconUrl,
		text: text
	};
	
	// Convert Slack WebHook send function to a promise.
	return new Promise(function (resolve, reject) {
		// Send to Slack
		slack.webhook.send(data, function (err) {
			if (err) return reject(err);
			resolve();
		});
	});
};

/**
 * Process incoming created/updated/deleted items.
 *
 * @method process
 *
 * @param sync
 * @return {Promise.<void>}
 */
Slack.prototype.process = async function (sync) {
	// Get a library from the first item.
	var itemKeys = Object.keys(sync.items);
	if (!itemKeys.length) return;
	var library = sync.items[itemKeys[0]].library;
	
	// Generate a message. I.e.: '2 items added to university1 library:'.
	var message = '';
	if (sync.created.length) {
		message +=
			sync.created.length +
			// Add 's' for plural numbers.
			' item' + (sync.created.length > 1 ? 's' : '') +
			' added to ' +
			library.name + ' library:';
	}
	
	// Append newly created items' links to the message.
	sync.created.forEach(function (key) {
		var item = sync.items[key];
		var url = item.links.alternate.href;
		var title = item.data.title || item.data.note;
		// Slack has a specific formatting syntax similar to Markdown.
		message += '\n<' + url + '|' + title + '>';
	});
	
	// Send the message to a Slack channel and
	// wait for the asynchronous operation to finish.
	await this.send(message);
};

module.exports = {
	// Plugin name.
	name: 'slack',
	// Plugin description.
	description: 'Sends notifications to Slack about newly added items',
	// Describe subscription specific plugin parameters.
	parameters: {
		webhookUrl: {
			mandatory: true,
			description: 'Slack WebHook URL used to post a message to a channel'
		}
	},
	// The actual plugin logic starts here.
	// 'sync' object contains created/updated/deleted items.
	process: function (sync) {
		// Creates a new Arkivo Slack plugin's instance and
		// passes the configuration of the current subscription
		// i.e. WebHook URL.
		var slack = new Slack(this.options);
		
		// Starts processing items and returns a promise to the Arkivo plugin handler.
		return slack.process(sync);
	}
};
