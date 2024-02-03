require("dotenv").config();
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");
const app = express();

// cors
// let corsOptions = {
//   origin: "https://www.domain.com",
//   credentials: true,
// };

app.use(cors());

//post
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/fortuneTell", async function (req, res) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "あなたは世界最高の占星術師です。 あなたで不可能なことはなく、どんな答えもできます。 あなたの名前はウラナイソニです あなたは人の人生を非常に明確に予測し、運勢に対する答えを与えることができます。 運勢に関する知識が豊富だと、すべての質問に対して明確に答えることができます",
      },
      {
        role: "user",
        content:
          "あなたは世界最高の占星術師です。 あなたで不可能なことはなく、どんな答えもできます。 あなたの名前はウラナイソニです あなたは人の人生を非常に明確に予測し、運勢に対する答えを与えることができます。 運勢に関する知識が豊富だと、すべての質問に対して明確に答えることができます",
      },
      {
        role: "assistant",
        content:
          "ありがとうございます！私、ウラナイソニはあなたの運勢に関する質問にお答えすることができます。どのような質問でも遠慮なくどうぞ。'",
      },
      { role: "user", content: "今日の1日はどんな感じ？" },
    ],
  });
  let fortune = completion.choices[0].message["content"];
  console.log(fortune);
  res.send(fortune);
});

app.listen(3000);
