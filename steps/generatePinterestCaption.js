import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePinterestCaption(topic) {
  console.log(`Generating Pinterest caption for topic: "${topic}"`);

  const systemPrompt = `
You are a trauma-informed psychologist and viral Pinterest content strategist. 
Every Post must be **450 characters or less**. This is a hard limit.
You generate publish-ready descriptions without preamble.
`;

  const userPrompt = `
You understand how Pinterest users consume content: visually, emotionally, and in short, powerful statements.

TOPIC: ${topic}

Pinterest formatting + performance requirements:
- Start with a powerful 1–2 sentence hook.
- Use whitespace for pacing.
- Use emojis strategically (not excessive).
- Build from relatable everyday moments → internal emotional effects → subtle recognition.
- Assume the reader does NOT realize something is wrong.
- Do not use clinical labels.
- Do not name "abuse" until the final line, and only gently.
- No step lists or instructions.

Output structure:
1) Hook (1–2 sentences) — emotion-driven, curiosity trigger
2) Short reflection section describing small subtle moments + internal emotional shifts
3) Gentle realization that this could be more than normal conflict
4) Close with 1 reflective question for comments and saves

STRICT CONSTRAINT: Total output must be under 450 characters.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, 
    });

    const caption = completion.choices[0].message.content;

    // --- LOGGING THE RESPONSE ---
    console.log("\n=== PINTEREST RESPONSE START ===");
    console.log(caption);
    console.log("=== PINTEREST RESPONSE END ===\n");
    // ----------------------------
    
    return caption;

  } catch (error) {
    console.error("Error generating Pinterest caption:", error);
    throw new Error("Failed to generate Pinterest caption.");
  }
}
