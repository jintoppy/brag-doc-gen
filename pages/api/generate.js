import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const samples = [
    {
      q: `How would you rate yourself on the scale of 1-10 based on your past year’s work?`,
      options: [7, 9, 8],
    },
    {
      q: `Did you achieve your OKR?`,
      options: [50, 65, 60],
    },
    {
      q: `Did you promote a positive culture within the team  and outside the team?`,
      options: [
        "Yes, I tried my level best",
        "Yes, I even trained the new interns",
        "Yes, but team was ignorant regarding all of my efforts ",
      ],
    },
    {
      q: `What was your most significant achievement from last year?`,
      options: [
        "Helped scale accounts by 10% QoQ",
        "Generated Revenue $10mm across 10+ accounts and helped clients with client acquisition and retention game, thereby increasing their MRR by 25%",
        "I played a major role in scaling accounts",
      ],
    },
    {
      q: `What you could have  done better in last year?`,
      options: [
        "I put enough efforts but I believe more efforts could have led me to achieve my OKR",
        "I guess I have done great. However I would have created more bonds while working",
        "I don't think, I would have done more",
      ],
    },
  ];

  let prompt = "";

  for (let i = 0; i < 3; i++) {
    let currentPrompt = "";
    samples.forEach((sample) => {
      currentPrompt += `
        Question: ${sample.q}
        Answer: ${sample.option[i]}
      `;
    });
    prompt += currentPrompt;
  }

  const data = req.body || "";
  if (data.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      },
    });
    return;
  }

  const userPrompt = {
    q1: data.q1 ?? 9,
    q2: data.q2 ?? 65,
    q3: data.q3 ?? "Yes, but team was ignorant regarding all of my efforts ",
    q4: data.q4 ?? "I played a major role in scaling accounts ",
    q5: data.q5 ?? `I don't think, I would have done more`,
  };

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Generate brag document.

  ${prompt}

${userPrompt}`;
}
