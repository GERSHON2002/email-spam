const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listAllModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // In @google/generative-ai, listing models is done via the GenAI object?
    // Actually, listing models often requires a different endpoint or is not directly in the SDK's simple methods.
    // Let's try to just guestimate common ones or use a more descriptive error check.
    
    // Testing specific ones that are common in different regions
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-2.0-flash-exp" // Newest 
    ];

    console.log("Checking model availability...");
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        if (result.response) {
          console.log(`✅ ${modelName} is available.`);
        }
      } catch (e) {
        console.log(`❌ ${modelName} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listAllModels();
