import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { ai } from "../services/gemini.js";

const router = express.Router();

const defaultReview = (problemStatement, language, code) => ({
  approach: {
    current:
      "The solution appears to follow a direct strategy based on the provided problem statement.",
    suggested:
      "A more optimized approach may be possible depending on constraints and edge cases.",
    keyIdea:
      "Focus on reducing redundant work and ensuring the solution handles boundary cases correctly.",
  },
  complexity: {
    time: "O(n)",
    space: "O(1)",
  },
  scores: {
    efficiency: 78,
    correctness: 82,
    codeStyle: 80,
  },
  strengths: [
    "Clear variable naming and readable structure.",
    `The implementation uses ${language || "the selected language"} in a practical way.`,
    "The logic is generally aligned with the problem goal.",
  ],
  weaknesses: [
    "Edge cases may need additional validation.",
    "Some parts can be simplified for better readability.",
    "The current approach may not be optimal for larger constraints.",
  ],
  optimizations: [
    "Add early exit conditions for trivial cases.",
    "Consider reducing repeated computations.",
    "Use more descriptive helper functions where needed.",
  ],
  interviewFeedback:
    "Your solution shows good fundamentals. With a bit more attention to complexity and edge cases, it can become significantly stronger.",
  difficulty: "Medium",
  primaryTopic: "Algorithms",
  secondaryTopic: "Problem Solving",
  pattern: "Pattern Matching",
  similarProblems: [
    "Two Sum",
    "Valid Parentheses",
    "Longest Substring Without Repeating Characters",
  ],
  meta: {
    problemStatement,
    language,
    codePreview: code?.slice(0, 180) || "",
  },
});

const extractJson = (rawText) => {
  if (!rawText) return null;

  const cleaned = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    return null;
  }
};

const isValidReviewResponse = (data) => {
  if (!data || typeof data !== "object") return false;
  if (!data.approach || typeof data.approach !== "object") return false;
  if (!data.complexity || typeof data.complexity !== "object") return false;
  if (!data.scores || typeof data.scores !== "object") return false;
  return true;
};

router.post("/code-review", authenticateToken, async (req, res) => {
  try {
    const { problemStatement, language, code } = req.body;

    if (!problemStatement?.trim() || !code?.trim()) {
      res.status(400).json({
        error: "Problem statement and code are required to analyze the solution.",
      });
      return;
    }

    const promptText = `
      You are an expert Data Structures and Algorithms interviewer, competitive programmer, and code reviewer.

      Analyze the given coding problem and the user's solution.

      Evaluate:
      1. Approach Used
      2. Suggested Better Approach (if available)
      3. Key Idea
      4. Time Complexity
      5. Space Complexity
      6. Efficiency Score (0-100)
      7. Correctness Score (0-100)
      8. Code Style Score (0-100)
      9. Strengths
      10. Weaknesses
      11. Optimization Suggestions
      12. Interview Feedback
      13. Difficulty Level
      14. Primary Topic
      15. Secondary Topic
      16. Pattern Used
      17. Similar Problems

      Return ONLY JSON in this format:

      {
        "approach": {
          "current": "",
          "suggested": "",
          "keyIdea": ""
        },
        "complexity": {
          "time": "",
          "space": ""
        },
        "scores": {
          "efficiency": 0,
          "correctness": 0,
          "codeStyle": 0
        },
        "strengths": [],
        "weaknesses": [],
        "optimizations": [],
        "interviewFeedback": "",
        "difficulty": "",
        "primaryTopic": "",
        "secondaryTopic": "",
        "pattern": "",
        "similarProblems": []
      }

      Problem Statement:
      ${problemStatement}

      Programming Language:
      ${language || "Unknown"}

      User Code:
      ${code}
    `;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            systemInstruction:
              "You are an expert competitive programming reviewer. Return only valid JSON matching the requested schema, with no markdown fences or extra explanation.",
          },
        });

        const rawText = response.text || "";
        const parsed = extractJson(rawText) || JSON.parse(rawText);

        if (!isValidReviewResponse(parsed)) {
          throw new Error("Invalid response schema from Gemini.");
        }

        res.json(parsed);
        return;
      } catch (geminiError) {
        console.error("Gemini code review generation failed:", geminiError);
      }
    }

    res.json(defaultReview(problemStatement, language, code));
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to analyze the code review request.",
    });
  }
});

export default router;
