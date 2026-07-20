import { getChatResponse } from "@/lib/groq";

const SOP_SYSTEM_PROMPT = `You are UniConnect AI's SOP Generator. Write compelling, personalized Statements of Purpose for university applications.

Follow these guidelines:
- Write 500-800 words
- Start with a strong personal hook
- Explain academic background and achievements
- Describe why the student chose this program/university
- Include career goals and how the program aligns
- End with a confident conclusion
- Use professional but natural language
- Be specific to the student's profile, not generic

Generate only the SOP content, no additional commentary.`;

export async function POST(req: Request) {
  try {
    const { university, country, degree, studentProfile, type } = await req.json();

    const userMessage = `Generate a ${type || "statement_of_purpose"} for:

University: ${university}
Country: ${country}
Degree: ${degree}
Student Profile: ${studentProfile}

Write a compelling, personalized ${(type || "statement_of_purpose").replace(/_/g, " ")}.`;

    const reply = await getChatResponse(
      [{ role: "user", content: userMessage }],
      SOP_SYSTEM_PROMPT,
      0.7,
      2048,
    );

    return Response.json({ content: reply, wordCount: reply.split(/\s+/).length });
  } catch (e) {
    return Response.json({ error: "Failed to generate SOP" }, { status: 500 });
  }
}
