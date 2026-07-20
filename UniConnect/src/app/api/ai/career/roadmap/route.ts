import { getChatResponse } from "@/lib/groq";

const CAREER_SYSTEM_PROMPT = `You are UniConnect AI's Career Guidance Expert. Based on a student's profile and interests, provide a comprehensive career roadmap with actionable steps.

Include:
- Career roadmap with short-term and long-term goals
- Required skills and certifications
- Recommended learning resources (courses, books, platforms)
- Internship and job opportunities in Pakistan
- Current job market trends and salary estimates
- Future growth opportunities
- Relevant universities and programs in Pakistan`;

export async function POST(req: Request) {
  try {
    const { careerGoal, currentEducation, field, skills, experience, preferredCity } = await req.json();

    const userMessage = `Student Profile for Career Guidance:
- Career Goal: ${careerGoal}
- Current Education: ${currentEducation || "Not specified"}
- Field of Interest: ${field || "Not specified"}
- Current Skills: ${skills || "Not specified"}
- Experience: ${experience || "Not specified"}
- Preferred City: ${preferredCity || "Not specified"}

Provide a detailed career roadmap including:
1. Step-by-step career roadmap with timeline
2. Required technical and soft skills
3. Learning resources (courses, books, platforms)
4. Internship and job opportunities
5. Current job market trends
6. Salary estimates in Pakistan and internationally
7. Future growth opportunities`;

    const reply = await getChatResponse(
      [{ role: "user", content: userMessage }],
      CAREER_SYSTEM_PROMPT,
      0.7,
      1536,
    );

    return Response.json({
      careerGoal,
      roadmap: reply,
      requiredSkills: [],
      learningResources: [],
      internships: [],
      jobTrends: "See roadmap for details",
      salaryEstimate: "See roadmap for details",
    });
  } catch (e) {
    return Response.json({ error: "Failed to generate career roadmap" }, { status: 500 });
  }
}
