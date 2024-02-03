require("dotenv").config();
const OpenAI = require("openai");
const app = require("express")();
const bodyParser = require("body-parser");
var cors = require("cors");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// cors Issue resolution
// let corsOptions = {
//   origin: "https://www.domain.com",
//   credentials: true,
// };

app.use(cors());

//post
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post("/fortuneTell", async function (req, res) {
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
  res.json({ assistant: fortune });
});

app.listen(3000);
