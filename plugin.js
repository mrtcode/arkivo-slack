'use strict';

// Load Arkivo default config object.
// It can be extended by creating ./config/default.json
// in the current plugin directory.
var config = require('arkivo/lib/config');


var common = require('arkivo/lib/common');
var extend = common.extend;

// Plugin uses Incoming WebHook to post messages to a Slack channel.
var IncomingWebhook = require('@slack/client').IncomingWebhook;

/**
 * Arkivo Slack plugin.
 *
 * @class Slack
 * @constructor
 */
var Slack = function (options) {
	// Set defaults for current options
	this.options = extend({}, Slack.defaults);
	
	// Extend options with Arkivo config i.e. ./config/default.json.
	if (config.has('slack')) {
		extend(this.options, config.get('slack'));
	}
	
	// Extend options with subscription specific parameters
	// passed to this plugin instance
	extend(this.options, options);
	
	// Initialize WebHook that points to a specific Slack channel
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
 */
Slack.prototype.send = function (text, callback) {
	// Customize message appearance
	var data = {
		username: this.options.botName,
		iconUrl: this.options.botIconUrl,
		text: text
	};
	
	this.webhook.send(data, function (err) {
		if (err) return callback(err);
		callback();
	});
};

/**
 * Process incoming created/updated/deleted items.
 *
 * @method process
 *
 * @param sync
 * @param callback
 */
Slack.prototype.process = function (sync, callback) {
	// Get a library from the first item
	var library = sync.items[Object.keys(sync.items)[0]].library;
	
	// Generate a message.
	var message = '';
	if (sync.created.length) {
		message +=
			sync.created.length +
			' item' + (sync.created.length > 1 ? 's' : '') +
			' added to ' +
			library.name + ' library:';
	}
	
	// Add newly created items' links to the message.
	sync.created.forEach(function (key) {
		var item = sync.items[key];
		var url = item.links.alternate.href;
		var title = item.data.title || item.data.note;
		message += '\n<' + url + '|' + title + '>';
	});
	
	// Send the message to a Slack channel.
	this.send(message, function (err) {
		if (err) return callback(err);
		callback();
	});
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
	process: function (sync, done) {
		// Creates a new Arkivo Slack plugin's instance and
		// passes a configuration of the current subscription
		// i.e. WebHook URL.
		var slack = new Slack(this.options);
		
		// Starts processing items and calls 'done' when finished.
		slack.process(sync, done);
	}
};
