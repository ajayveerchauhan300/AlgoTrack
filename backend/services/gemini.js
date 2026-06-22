import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let ai = null;

try {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log(
      "No GEMINI_API_KEY found. Operating in fallback mock mode for AI Mentor."
    );
  } else {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    console.log("Gemini API initialized successfully.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini API:", error);
}

export { ai };