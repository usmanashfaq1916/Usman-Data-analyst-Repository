import { getChatResponse } from "@/lib/groq";

const RESUME_SYSTEM_PROMPT = `You are UniConnect AI's Resume Builder. Help students create ATS-friendly resumes for university applications and internships.

For each resume, provide all sections below. Use the exact markers shown.

Start each section with the marker on its own line:

[SUMMARY]
Write a professional summary (2-3 sentences).

[SKILLS]
List suggested skills as a comma-separated list (relevant to their target role).

[PROJECTS]
Write 2-3 improved project descriptions, each on a new line starting with "- ".

[IMPROVEMENTS]
Write 2-3 actionable tips to strengthen their resume.

Be specific and practical. Focus on Pakistani education and job market context.`;

export async function POST(req: Request) {
  try {
    const { name, education, skills, projects, experience, targetRole } = await req.json();

    const userMessage = `Generate resume improvements for:

Name: ${name}
Education: ${education}
Current Skills: ${skills}
Projects: ${projects}
Experience: ${experience}
Target Role: ${targetRole}

Provide all sections with the exact markers as instructed.`;

    const reply = await getChatResponse(
      [{ role: "user", content: userMessage }],
      RESUME_SYSTEM_PROMPT,
      0.7,
      2048,
    );

    let summary = "";
    const skillsList: string[] = [];
    const projectsList: string[] = [];
    let currentSection: string | null = null;

    for (const line of reply.split("\n")) {
      const stripped = line.trim();
      if (stripped === "[SUMMARY]") { currentSection = "summary"; continue; }
      if (stripped === "[SKILLS]") { currentSection = "skills"; continue; }
      if (stripped === "[PROJECTS]") { currentSection = "projects"; continue; }
      if (stripped === "[IMPROVEMENTS]") { currentSection = null; continue; }

      if (currentSection === "summary" && stripped) {
        summary = (summary + " " + stripped).trim();
      } else if (currentSection === "skills" && stripped) {
        for (const s of stripped.split(",")) {
          const clean = s.trim().replace(/^-/, "").trim();
          if (clean) skillsList.push(clean);
        }
      } else if (currentSection === "projects" && stripped) {
        const clean = stripped.replace(/^- /, "").trim();
        if (clean) projectsList.push(clean);
      }
    }

    return Response.json({
      summary: summary || reply.split("\n")[0] || "Professional summary based on your profile.",
      suggestedSkills: skillsList.length > 0 ? skillsList : ["Communication", "Teamwork", "Problem Solving"],
      projectDescriptions: projectsList.length > 0 ? projectsList : [reply],
    });
  } catch (e) {
    return Response.json({ error: "Failed to generate resume" }, { status: 500 });
  }
}
