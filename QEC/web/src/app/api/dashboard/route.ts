import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  const role = req.nextUrl.searchParams.get("role") || session?.user?.role || "STUDENT"

  const baseStats = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.campus.count(),
    prisma.admission.count(),
    prisma.admission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.campus.findMany({ select: { name: true, _count: { select: { enrollments: true } } } }),
    prisma.program.count(),
  ])

  const [totalStudents, totalTeachers, totalCampuses, totalAdmissions, recentAdmissions, campusDistribution, programCount] = baseStats

  const managementDashboard = {
    totalStudents,
    totalTeachers,
    totalCampuses,
    totalAdmissions,
    programCount,
    recentAdmissions,
    campusDistribution: campusDistribution.map((c) => ({
      name: c.name,
      students: c._count.enrollments,
    })),
    activeAdmissions: await prisma.admission.count({ where: { status: "Submitted" } }),
  }

  const studentDashboard = {
    enrolledCourses: 4,
    attendance: 85,
    fee: 4500,
    gpa: 3.6,
  }

  const teacherDashboard = {
    activeClasses: 4,
    totalStudents: 141,
    weeklyHours: 18,
    avgAttendance: 87,
  }

  const parentDashboard = {
    children: 2,
    avgGpa: 3.85,
    avgAttendance: 93,
    feeStatus: "Clear",
  }

  let data: Record<string, unknown>
  switch (role) {
    case "ADMIN":
    case "MANAGEMENT":
      data = managementDashboard
      break
    case "TEACHER":
      data = { ...teacherDashboard, ...managementDashboard }
      break
    case "PARENT":
      data = { ...parentDashboard, ...managementDashboard }
      break
    default:
      data = { ...studentDashboard, ...managementDashboard }
  }

  return NextResponse.json(data)
}
