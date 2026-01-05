import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePinterestCaption(topic) {
  console.log(`Generating Pinterest Title & Caption for topic: "${topic}"`);

  const systemPrompt = `
You are a trauma-informed psychologist and viral Pinterest content strategist.
You output JSON only.
Your goal is to create two distinct assets:
1. A **Pinterest Title**: High click-through rate, SEO-friendly, short (under 100 chars).
2. A **Pinterest Caption**: Emotional, reflective, under 450 characters.
`;

  const userPrompt = `
TOPIC: ${topic}

REQUIREMENTS:

1. **TITLE**: 
- Must be "Pinterest Friendly" (e.g., "5 Signs You...", "Why You Feel...", "The Hidden Pattern of...").
- Short, punchy, clear text overlay style.

2. **CAPTION**:
- **Strict Limit:** Under 450 characters total.
- **Structure:** - Hook (1-2 sentences).
  - Short reflection on internal shifts.
  - Gentle realization (don't name "abuse" until the end).
  - 1 Reflective Question.
- No "Title:" or labels inside the caption text.
- No step lists.

OUTPUT FORMAT (JSON):
{
  "title": "The generated title here",
  "caption": "The generated caption text here"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, // Forces structured output
      temperature: 0.7, 
    });

    // Parse the JSON string back into a JavaScript Object
    const responseData = JSON.parse(completion.choices[0].message.content);

    // --- LOGGING ---
    console.log("\n=== PINTEREST RESPONSE START ===");
    console.log("TITLE: " + responseData.title);
    console.log("CAPTION: " + responseData.caption);
    console.log("=== PINTEREST RESPONSE END ===\n");
    // --------------
    
    return responseData; // Returns { title, caption }

  } catch (error) {
    console.error("Error generating Pinterest content:", error);
    throw new Error("Failed to generate Pinterest content.");
  }
}
