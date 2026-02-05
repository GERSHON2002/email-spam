const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const modelList = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels(); // This is not the correct way to list models in the new SDK
    // Let's use the correct service
  } catch (e) {
    // Correct way depends on version, but let's try a direct approach to check connectivity and model names
  }
}

// Actually, let's just create a more robust test script to try different model names
async function testModel(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log(`Testing model: ${modelName}...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello?");
    console.log(`Success with ${modelName}:`, result.response.text());
    return true;
  } catch (error) {
    console.log(`Failed with ${modelName}:`, error.message);
    return false;
  }
}

async function run() {
  const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.5-pro"];
  for (const m of models) {
    if (await testModel(m)) break;
  }
}

run();
