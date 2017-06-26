# Arkivo Slack plugin example
Get notifications to your Slack about newly added items in Zotero libraries.

![Slack Screenshot](https://mrtcode.github.io/arkivo-slack/slack.png)

This is a plugin for Arkivo.
[Arkivo](https://github.com/zotero/arkivo) is a plugin platform for processing created/updated/deleted
items from specified Zotero libraries.

## Requirements
* Node.js 7.6 or higher (needs await/async support)
* Redis running on localhost:6379

## Setup instructions

### Download this plugin and install Node.js modules
```
git clone https://github.com/mrtcode/arkivo-slack
cd arkivo-slack
npm install
```

### Create a Slack Incoming WebHook URL for a specific channel.
1. Go to https://my.slack.com/services/new/incoming-webhook/
2. Choose a channel where you want this plugin to post messages.
3. Click "Add Incoming WebHook integration".
4. Copy the link from "WebHook URL" section.

### Add an Arkivo subscription
Each subscription can have multiple plugins and each plugin can have different configuration that is valid only for the specific subscription.

```
$(npm bin)/arkivo subscriptions add ITEMS_URL_PATH --key ZOTERO_KEY --plugins PLUGIN_NAME:CONFIGURATION
```

* `ITEMS_URL_PATH` - A path part of Zotero API endpoint URL that returns items array. For example:
	* `/users/123456/items` - fetches all updated items.
	* `/groups/123456/items?tag=tag1` - fetches items with a matching tag.
	* `/users/123456/items?q=title` - fetches items with a matching title.
	* `/groups/123456/items?itemType=book` - fetches items with a matching item type.
	* `/users/123456/collections/HNR32E9N/items` - fetches items from a specified collection.
* `ZOTERO_KEY` - A Zotero access key to the library we are subscribing. For public libraries key isn't necessary.
* `PLUGIN_NAME` - Activates a plugin for the subscription.
* `CONFIGURATION` - A stringified configuration JSON without spaces or new lines. Only `webhookUrl` is necessary for this plugin.

A full command line example to create a subscription with an activated Slack plugin and configured Slack WebHook URL:

```
$(npm bin)/arkivo subscriptions add /users/123456/items --key vdZB5zVvYbai7ETJlln5vRyi --plugins slack:\"webhookUrl\":\"https://hooks.slack.com/services/V9XBFPRFA/Y7XCFK4WG/ejO6LLyVlRKNqRpi1p4V2Mga\"
```

### Start Arkivo
```
$(npm bin)/arkivo up
```
