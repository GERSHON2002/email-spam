const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-pro-vision",
    "gemini-1.0-pro"
  ];

  console.log("Starting deep model check...");
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("hello");
      const text = await result.response.text();
      console.log(`✅ SUCCESS: ${modelName} -> ${text.substring(0, 20)}...`);
      break; 
    } catch (e) {
      console.log(`❌ FAILED: ${modelName} -> ${e.message}`);
    }
  }
}

run();
