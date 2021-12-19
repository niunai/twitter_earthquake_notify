const { ETwitterStreamEvent, TwitterApi } = require("twitter-api-v2");
const needle = require("needle");
const player = require("play-sound")();
const { makeNotifyMsg } = require("./util");
require("dotenv").config();

if (typeof process.env.TWITTER_BEARER_TOKEN == "undefined") {
  console.error('Error: "TWITTER_BEARER_TOKEN" is not set.');
  process.exit(1);
}

if (typeof process.env.GH_VOICETEXT_API_ENDPOINT_URL == "undefined") {
  console.error('Error: "GH_VOICETEXT_API_ENDPOINT_URL" is not set.');
  process.exit(1);
}

if (typeof process.env.BEEP_SOUND_FILE == "undefined") {
  console.error('Error: "BEEP_SOUND_FILE" is not set.');
  process.exit(1);
}

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
const client = twitterClient.readOnly;

gh_notify = (msg) => {
  const data = {
    text: msg,
  };

  needle("post", process.env.GH_VOICETEXT_API_ENDPOINT_URL, data);
};

beep = () => {
  player.play(process.env.BEEP_SOUND_FILE, (err) => {
    if (err) console.log(err);
  });
};

fetchData = async () => {
  const rules = await client.v2.streamRules();
  if (rules.data?.length) {
    await client.v2.updateStreamRules({
      delete: { ids: rules.data.map((rule) => rule.id) },
    });
  }

  await client.v2.updateStreamRules({
    add: [
      { value: "from:yurekuru", tag: "earthquake" },
      { value: "from:earthquake_jp", tag: "earthquake" },
    ],
  });

  const stream = await client.v2.searchStream({
    "user.fields": ["name"],
    expansions: ["author_id"],
  });
  stream.autoReconnect = true;

  console.log("Listen to the stream...");

  stream.on(ETwitterStreamEvent.Data, async (tweet) => {
    const username = tweet.includes.users.find(
      (elm) => elm.id === tweet.data.author_id
    ).username;
    const text = tweet.data.text;
    console.log(`===`);
    console.log(username, text);

    const msg = makeNotifyMsg(username, text);
    if (msg) {
      gh_notify(msg);
      console.log("gh_notify: ", msg);
    } else {
      beep();
      console.log("beep");
    }
  });

  stream.on(ETwitterStreamEvent.Error, async (error) => {
    console.error(`Twitter Event:Error: ${error.message}`);
  });
  stream.on(ETwitterStreamEvent.ReconnectAttempt, async () => {
    console.error(`Twitter Event:ReconnectAttempt`);
  });
  stream.on(ETwitterStreamEvent.Reconnected, async () => {
    console.error(`Twitter Event:Reconnected`);
  });
  // stream.on(ETwitterStreamEvent.DataKeepAlive, async () => {
  //   console.error(`Twitter Event:DataKeepAlive`);
  // });
  stream.on(ETwitterStreamEvent.Connected, async () => {
    console.error("Connected to the Twitter stream");
  });
};

fetchData();
