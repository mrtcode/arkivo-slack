# Arkivo Slack plugin example
Get notifications to your Slack about newly added items in Zotero libraries.

![Slack Screenshot](https://mrtcode.github.io/arkivo-slack/slack.png)

## Setup instructions

### Install and start Redis
```
apt-get install redis
service redis start
```

### Download this plugin and install node modules
```
git clone https://.../arkivo-slack
npm install
```

### Create a Slack Incoming WebHook URL for a specific channel.
1. Go to https://my.slack.com/services/new/incoming-webhook/
2. Choose a channel where you want this plugin to post messages.
3. Click "Add Incoming WebHook integration".
4. Copy the link from "Webhook URL" section.

### Add Arkivo subscription
```
$(npm bin)/arkivo subscriptions add /groups/123456/items --key ZOTERO-KEY --plugins slack:\"webhookUrl\":\"SLACK-WEBHOOK-URL\"
```

### Start Arkivo
```
$(npm bin)/arkivo up
```
