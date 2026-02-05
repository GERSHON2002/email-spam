const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testFlashLatest() {
  console.log("Testing gemini-flash-latest...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("hello");
    console.log("✅ SUCCESS with gemini-flash-latest:", await result.response.text());
  } catch (e) {
    console.log("❌ FAILED with gemini-flash-latest:", e.message);
  }
}

testFlashLatest();
