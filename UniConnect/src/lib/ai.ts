interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  message: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const res = await fetch(`/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error("Failed to get AI response");
  const data: ChatResponse = await res.json();
  return data.reply;
}

export async function predictMerit(data: {
  matric: number;
  inter: number;
  entryTest: number;
  formula?: string;
  preferredPrograms?: string[];
}) {
  const res = await fetch(`/api/ai/merit/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to predict merit");
  return res.json();
}

export async function recommendUniversities(data: {
  matric: number;
  inter: number;
  entryTest: number;
  budget?: string;
  city?: string;
  preferredProgram?: string;
  province?: string;
  universityType?: string;
}) {
  const res = await fetch(`/api/ai/recommend/universities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get recommendations");
  return res.json();
}

export async function generateSOP(data: {
  university: string;
  country: string;
  degree: string;
  studentProfile: string;
  type?: string;
}) {
  const res = await fetch(`/api/ai/sop/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate SOP");
  return res.json();
}

export async function generateResume(data: {
  name: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  targetRole: string;
}) {
  const res = await fetch(`/api/ai/resume/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate resume");
  return res.json();
}

export async function recommendScholarships(data: {
  matric?: number;
  inter?: number;
  cgpa?: number;
  financialStatus?: string;
  degreeLevel?: string;
  field?: string;
  country?: string;
  budget?: string;
}) {
  const res = await fetch(`/api/ai/scholarships/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to get scholarship recommendations");
  return res.json();
}

export async function generateCareerRoadmap(data: {
  careerGoal: string;
  currentEducation?: string;
  field?: string;
  skills?: string;
  experience?: string;
  preferredCity?: string;
}) {
  const res = await fetch(`/api/ai/career/roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate career roadmap");
  return res.json();
}
