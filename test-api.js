import dotenv from "dotenv";

dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY; // or paste directly for testing
const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello! Are you working?");
    console.log("✅ API Response:\n", result.response.text());
  } catch (error) {
    console.error("❌ API Error:", error.message);
  }
}

testAPI();
