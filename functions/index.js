const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

// ponytail: single onCall function, no framework/router — this is the whole backend surface for now.
exports.getAiAssistantResponse = onCall(
  { secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in required.");
    }

    const { prompt, systemInstruction, model } = request.data ?? {};
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new HttpsError("invalid-argument", "prompt is required.");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${
      model || "gemini-1.5-flash"
    }:generateContent?key=${geminiApiKey.value()}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction || "" }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, topP: 0.85, topK: 40, maxOutputTokens: 200 },
      }),
    });

    if (!res.ok) {
      throw new HttpsError("internal", `Gemini request failed with ${res.status}`);
    }

    const data = await res.json();
    const text =
      data.candidates
        ?.flatMap((c) => c.content?.parts ?? [])
        .map((p) => p.text ?? "")
        .join(" ")
        .trim() || null;

    return { text };
  },
);
