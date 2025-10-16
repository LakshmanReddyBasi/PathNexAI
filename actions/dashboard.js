"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Primary model to use; can be overridden via ENV (GEMINI_MODEL)
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const FALLBACK_MODEL = "text-bison-001"; // fallback to a supported text model

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  // Try primary model first, then fallback if the model is not available
  let result;
  try {
    const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
    result = await model.generateContent(prompt);
  } catch (err) {
    console.warn(
      `Primary model ${PRIMARY_MODEL} failed, attempting fallback ${FALLBACK_MODEL}:`,
      err?.message || err
    );

    // If primary model failed due to model not found or unsupported method, try fallback
    const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
    result = await fallbackModel.generateContent(prompt);
  }

  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  // Parse the JSON returned by the model. If the model returns no salaryRanges
  // (or returns malformed JSON), fall back to a conservative, generic set of
  // salary ranges so the dashboard has something to render instead of being
  // blank. This keeps the app usable when the Gemini/model API is unavailable
  // or returns unexpected output.
  try {
    const parsed = JSON.parse(cleanedText);

    if (!parsed || !Array.isArray(parsed.salaryRanges) || parsed.salaryRanges.length === 0) {
      console.warn(`generateAIInsights: model returned no salaryRanges for industry=", industry, ", using fallback ranges`);
      parsed.salaryRanges = getFallbackSalaryRanges(industry);
    }

    return parsed;
  } catch (err) {
    console.warn("generateAIInsights: failed to parse model output, using fallback insights:", err?.message || err);
    return {
      salaryRanges: getFallbackSalaryRanges(industry),
      growthRate: 0,
      demandLevel: "Medium",
      topSkills: [],
      marketOutlook: "Neutral",
      keyTrends: [],
      recommendedSkills: [],
    };
  }
};

// Conservative, generic fallback salary ranges (numbers in full currency units).
// These are intentionally conservative placeholders and should be replaced by
// real data once the AI job or a manual update provides real numbers.
function getFallbackSalaryRanges(industry) {
  // Keep roles generic while mentioning the industry to provide context.
  return [
    { role: `${industry} - Entry Level`, min: 30000, median: 40000, max: 55000, location: "Remote" },
    { role: `${industry} - Associate`, min: 45000, median: 60000, max: 80000, location: "Remote" },
    { role: `${industry} - Mid-level`, min: 65000, median: 85000, max: 110000, location: "Remote" },
    { role: `${industry} - Senior`, min: 90000, median: 120000, max: 160000, location: "Remote" },
    { role: `${industry} - Lead/Manager`, min: 120000, median: 150000, max: 200000, location: "Remote" },
  ];
}

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
