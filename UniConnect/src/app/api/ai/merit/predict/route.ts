import { getChatResponse } from "@/lib/groq";

const MERIT_SYSTEM_PROMPT = `You are UniConnect AI's Merit Predictor. Analyze the student's academic profile and predict their admission chances.

Given their matric marks, intermediate marks, entry test score, and the merit formula used by Pakistani universities, calculate their aggregate and predict their chances of admission.

Provide:
1. Their calculated aggregate percentage
2. A probability assessment (High > 75%, Medium 40-75%, Low < 40%)
3. A brief explanation of their chances
4. Suggested programs/universities where they might get admission

Be realistic and data-driven. Use standard Pakistani university merit formulas:
- NUST: Matric 10% + FSc 40% + Entry Test 50%
- FAST: Matric 10% + FSc 40% + Entry Test 50%
- UET: Matric 10% + FSc 40% + Entry Test 50%
- LUMS: SAT/LCAT based, typically 85%+ for top programs
- COMSATS: Matric 10% + FSc 40% + Entry Test 50%
- University of Punjab: Matric 10% + FSc 40% + Entry Test 50%`;

export async function POST(req: Request) {
  try {
    const { matric, inter, entryTest, formula, preferredPrograms } = await req.json();
    const aggregate = Math.round((matric * 0.1 + inter * 0.4 + entryTest * 0.5) * 100) / 100;
    const programs = preferredPrograms || [];

    const userMessage = `Student Profile:
- Matric Marks: ${matric}%
- Intermediate Marks: ${inter}%
- Entry Test Score: ${entryTest}%
- Calculated Aggregate: ${aggregate}%
- Preferred Programs: ${programs.length > 0 ? programs.join(", ") : "Not specified"}

Predict their admission chances and suggest suitable programs/universities.`;

    const reply = await getChatResponse(
      [{ role: "user", content: userMessage }],
      MERIT_SYSTEM_PROMPT,
      0.7,
      1024,
    );

    let probability = "Medium";
    let confidence = "Moderate";
    if (aggregate >= 75) {
      probability = "High";
      confidence = "Strong";
    } else if (aggregate < 40) {
      probability = "Low";
      confidence = "Weak";
    }

    return Response.json({ probability, confidence, explanation: reply, programs });
  } catch (e) {
    return Response.json({ error: "Failed to predict merit" }, { status: 500 });
  }
}
