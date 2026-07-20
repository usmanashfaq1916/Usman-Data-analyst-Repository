import { getChatResponse } from "@/lib/groq";

const SCHOLARSHIP_SYSTEM_PROMPT = `You are UniConnect AI's Scholarship Recommender. Based on a student's academic and financial profile, recommend the best scholarships available for them in Pakistan and internationally.

Consider:
- Academic marks and merit
- Financial status and need
- Degree level and field of study
- Country preference
- Scholarship deadlines
- Merit-based vs need-based eligibility
- Government, university, and private scholarships

Provide 5-8 scholarship recommendations ranked by match strength, with eligibility details and application tips.`;

export async function POST(req: Request) {
  try {
    const { matric, inter, cgpa, financialStatus, degreeLevel, field, country, budget } = await req.json();

    const userMessage = `Student Profile for Scholarship Search:
- Matric Marks: ${matric ?? "Not specified"}
- Intermediate Marks: ${inter ?? "Not specified"}
- CGPA: ${cgpa ?? "Not specified"}
- Financial Status: ${financialStatus ?? "Not specified"}
- Degree Level: ${degreeLevel ?? "Not specified"}
- Field of Study: ${field ?? "Not specified"}
- Preferred Country: ${country || "Pakistan"}
- Budget: ${budget ?? "Not specified"}

Recommend 5-8 scholarships with match scores and detailed reasons explaining why each scholarship is suitable.`;

    const reply = await getChatResponse(
      [{ role: "user", content: userMessage }],
      SCHOLARSHIP_SYSTEM_PROMPT,
      0.7,
      1024,
    );

    return Response.json({
      recommendations: [{ name: "Based on AI Analysis", matchScore: 85, reason: reply }],
    });
  } catch (e) {
    return Response.json({ error: "Failed to get scholarship recommendations" }, { status: 500 });
  }
}
