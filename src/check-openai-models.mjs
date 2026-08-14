import OpenAI from "openai";
import { config } from "dotenv";

config({ path: ".env.local" });

const key = process.env.OPENAI_API_KEY;

if (!key) {
  console.error("OPENAI_API_KEY was not found in .env.local");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: key,
});

try {
  const response = await openai.models.list();

  const models = response.data
    .map((model) => model.id)
    .filter((id) =>
      id.toLowerCase().includes("gpt")
    )
    .sort();

  console.log("\nAVAILABLE GPT MODELS:\n");

  for (const model of models) {
    console.log(model);
  }

  console.log("\nTotal:", models.length);
} catch (error) {
  console.error("\nOPENAI ERROR:\n");
  console.error(error);
}