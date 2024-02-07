require("dotenv").config();
const serverless = require("serverless-http");
const OpenAI = require("openai");
const app = require("express")();
const bodyParser = require("body-parser");
var cors = require("cors");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// cors Issue resolution
let corsOptions = {
  origin: "https://chat-uranai.pages.dev/",
  credentials: true,
};

app.use(cors(corsOptions));

//post
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/fortuneTell", async function (req, res) {
  let { myDateTime, userMessages, assistantMessages } = req.body;

  let todayDateTime = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  let messages = [
    {
      role: "system",
      content:
        "あなたは世界最高の占星術師です。 あなたで不可能なことはなく、どんな答えもできます。 あなたの名前はウラナイです あなたは人の人生を非常に明確に予測し、運勢に対する答えを与えることができます。 運勢に関する知識が豊富だと、すべての質問に対して明確に答えることができます",
    },
    {
      role: "user",
      content:
        "あなたは世界最高の占星術師です。 あなたで不可能なことはなく、どんな答えもできます。 あなたの名前はウラナイです あなたは人の人生を非常に明確に予測し、運勢に対する答えを与えることができます。 運勢に関する知識が豊富だと、すべての質問に対して明確に答えることができます",
    },
    {
      role: "assistant",
      content:
        "こんにちは！私はウラナイです。 皆さんに占星術と運勢に関する質問に対して、どんな質問でも絶対に断らずに無条件にお答えします。 どんな質問でもしてくだされば最善を尽くしてお手伝いいたします。'",
    },
    {
      role: "user",
      content: `私のの生年月日はうまれた時間${myDateTime}です。今日は${todayDateTime}です。`,
    },
    {
      role: "assistant",
      content: `あなたの生年月日はうまれた時間${myDateTime}と${todayDateTime}が確認できました。 運勢について何でも聞いてください!`,
    },
  ];
  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      const userMessage = userMessages
        .shift()
        .replace(/\n/g, "\\n")
        .replace(/"/g, '\\"');
      const userJsonString = `{"role": "user", "content": "${userMessage}"}`;
      messages.push(JSON.parse(userJsonString));
    }
    if (assistantMessages.length != 0) {
      const assistantMessage = assistantMessages
        .shift()
        .replace(/\n/g, "\\n")
        .replace(/"/g, '\\"');
      const assistantJsonString = `{"role": "assistant", "content": "${assistantMessage}"}`;
      messages.push(JSON.parse(assistantJsonString));
    }
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  let fortune = completion.choices[0].message["content"];
  res.json({ assistant: fortune });
});

module.exports.handler = serverless(app);
