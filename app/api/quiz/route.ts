import { NextResponse } from "next/server";
import { fallbackQuiz } from "./fallbackQuiz";

// 🧠 In-memory cache
let cachedQuiz: any[] | null = null;
let cacheTime = 0;

// ⏱ cache duration (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

export async function GET() {
  try {
    const now = Date.now();

    // ✅ Serve from cache if valid
    if (cachedQuiz && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json({ questions: cachedQuiz });
    }

    // 🔁 Fetch from Groq only if cache expired
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. Respond ONLY with valid JSON.",
          },
          {
            role: "user",
            content: `
Generate 10 multiple choice questions.

Return ONLY JSON in this format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "one option"
    }
  ]
}
              `,
          },
        ],
        temperature: 0.6,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Groq API failed");
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty Groq response");
    }

    const parsed = JSON.parse(content);

    if (!parsed?.questions) {
      throw new Error("Invalid quiz structure");
    }

    // ✅ Save to cache
    cachedQuiz = parsed.questions;
    cacheTime = now;

    return NextResponse.json({ questions: cachedQuiz });
  } catch (error) {
    console.error("Quiz API error:", error);

    // 🧯 Fallback quiz (NEVER FAILS)
    return NextResponse.json({
      questions: fallbackQuiz,
      fallback: true,
    });
  }
}
