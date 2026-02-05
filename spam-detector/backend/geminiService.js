const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeEmail(text, imageBuffer = null, mimeType = null) {
  try {
    // gemini-flash-latest is the confirmed working model name for this key/region
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let prompt = `
      You are an expert email security analyst. Analyze the following email content and classify it as "Spam" or "Ham" (Not Spam).
      Provide the result in the following JSON format:
      {
        "classification": "Spam" | "Ham",
        "confidence": number (between 0 and 1),
        "reasoning": "A brief explanation of why this classification was made, mentioning specific patterns like urgency, suspicious links, or greeting style.",
        "key_flags": ["list", "of", "suspicious", "patterns"]
      }
    `;

    let result;
    if (imageBuffer && mimeType) {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      };
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent([prompt, text]);
    }

    const response = await result.response;
    const responseText = response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Failed to parse AI response as JSON");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

module.exports = { analyzeEmail };
