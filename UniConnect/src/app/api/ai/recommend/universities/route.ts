import { getChatResponse } from "@/lib/groq";

const RECOMMEND_SYSTEM_PROMPT = `You are UniConnect AI's University Recommender. Based on a student's academic profile, preferences, and budget, recommend the best Pakistani universities and programs for them.

Consider:
- Merit/aggregate score compatibility
- Budget and fee structure
- Location/city preferences
- Program availability
- University type (public/private/military)
- Career prospects and industry connections

Provide 5-8 recommendations ranked by match strength, with brief reasons for each.`;

export async function POST(req: Request) {
  try {
    const { matric, inter, entryTest, budget, city, preferredProgram, province, universityType } = await req.json();
    const aggregate = Math.round((matric * 0.1 + inter * 0.4 + entryTest * 0.5) * 100) / 100;

    const userMessage = `Student Profile:
- Aggregate: ${aggregate}%
- Budget: ${budget || "Not specified"}
- Preferred City: ${city || "Not specified"}
- Preferred Program: ${preferredProgram || "Not specified"}
- Province: ${province || "Not specified"}
- University Type: ${universityType || "Not specified"}

Recommend 5-8 Pakistani universities with match scores and reasons.`;

    const reply = await getChatResponse(
      [{ role: "user", content: userMessage }],
      RECOMMEND_SYSTEM_PROMPT,
      0.7,
      1024,
    );

    return Response.json({
      recommendations: [{ name: "Based on AI Analysis", matchScore: 85, reason: reply }],
    });
  } catch (e) {
    return Response.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}
