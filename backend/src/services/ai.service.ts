import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeTicket(message: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
          You are a professional customer support triage assistant.

          Your task:
          1. Categorize the complaint into one of:
            - Billing
            - Technical
            - FeatureRequest

          2. Score sentiment from 1 to 10:
            - 1 = extremely negative
            - 5 = neutral
            - 10 = extremely positive

          3. Determine urgency:
            - High (angry customer, financial issue, service blocked)
            - Medium (issue affecting usage but not critical)
            - Low (general inquiry or suggestion)

          4. Write a polite, empathetic, professional support response.

          STRICT RULES:
          - Return ONLY valid JSON.
          - Do NOT include markdown.
          - Do NOT include explanations.
          - The draft must NOT repeat the user's message.
          - The draft must acknowledge the issue.
          - The draft must explain next steps.
          - The draft must be at least 2 sentences long.

          Return this exact JSON structure:

          {
            "category": "Billing | Technical | FeatureRequest",
            "sentiment": number,
            "urgency": "High | Medium | Low",
            "draft": string
          }
          `
      },
      {
        role: "user",
        content: message
      }
    ],
  });

  return response.choices[0].message.content;
}
