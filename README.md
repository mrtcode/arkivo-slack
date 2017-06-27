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

### Start Arkivo
```
$(npm bin)/arkivo up
```

### Create a Slack Incoming WebHook URL for a specific channel.
1. Go to https://my.slack.com/services/new/incoming-webhook/
2. Choose a channel where you want this plugin to post messages.
3. Click "Add Incoming WebHook integration".
4. Copy the link from "WebHook URL" section.

### Add an Arkivo subscription
Each subscription can have multiple plugins and each plugin can have different configuration that is valid only for the specific subscription.

Arkivo has an integrated HTTP API which can be used to create or delete subscriptions.

Here is a request example to create a subscription with an activated and configured Arkivo Slack plugin:

```
curl -X POST http://localhost:8888/api/subscription \
-H 'Content-Type: application/json' \
-d @- << EOF
{
  "url": "/users/123456/items",
  "key": "vdZB5zVvYbai7ETJlln5vRyi",
  "skip": true,
  "plugins": [
    {
      "name": "logger",
      "options": {
        "webhookUrl": "https://hooks.slack.com/services/V9XBFPRFA/Y7XCFK4WG/ejO6LLyVlRKNqRpi1p4V2Mga"
      }
    }
  ]
}
EOF
```

Explanation of JSON parameters in the request.

* `url` - A path part of Zotero API endpoint URL that returns item array. For example:
	* `/users/123456/items` - fetches all updated items.
	* `/groups/123456/items?tag=tag1` - fetches items with a matching tag.
	* `/users/123456/items?q=title` - fetches items with a matching title.
	* `/groups/123456/items?itemType=book` - fetches items with a matching item type.
	* `/users/123456/collections/HNR32E9N/items` - fetches items from a specified collection.
* `key` - A Zotero access key to the library we are subscribing. For public libraries key isn't necessary.
* `skip` - Skip processing already existing items.
* `plugins.name` - Activates the plugin for the current subscription.
* `plugins.options` - Plugin options for the current subscription. Only `webhookUrl` is necessary for this plugin.
