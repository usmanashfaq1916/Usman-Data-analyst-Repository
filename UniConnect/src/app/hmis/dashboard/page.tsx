import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SuperAdminDashboard } from "./super-admin-dashboard";
import { ChairmanDashboard } from "./chairman-dashboard";
import { DirectorDashboard } from "./director-dashboard";
import { PrincipalDashboard } from "./principal-dashboard";
import { HodDashboard } from "./hod-dashboard";
import { TeacherDashboard } from "./teacher-dashboard";
import { HrDashboard } from "./hr-dashboard";
import { StudentDashboard } from "./student-dashboard";
import { ParentDashboard } from "./parent-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role as string;
  const instituteId = (session.user as any).instituteId as string | null;

  const getCounts = async () => {
    if (!instituteId) return { students: 0, teachers: 0, employees: 0, departments: 0, programs: 0, classes: 0 };
    const [students, teachers, employees, departments, programs, classes] = await Promise.all([
      prisma.studentProfile.count({ where: { instituteId, isActive: true } }),
      prisma.employee.count({ where: { instituteId, type: "TEACHING", isActive: true } }),
      prisma.employee.count({ where: { instituteId, isActive: true } }),
      prisma.hmisDepartment.count({ where: { instituteId } }),
      prisma.hmisProgram.count({ where: { instituteId, isActive: true } }),
      prisma.classSection.count({ where: { instituteId, isActive: true } }),
    ]);
    return { students, teachers, employees, departments, programs, classes };
  };

  const counts = await getCounts();

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return <SuperAdminDashboard counts={counts} instituteId={instituteId} />;
    case "CHAIRMAN":
      return <ChairmanDashboard counts={counts} />;
    case "DIRECTOR":
      return <DirectorDashboard counts={counts} />;
    case "PRINCIPAL":
      return <PrincipalDashboard counts={counts} />;
    case "HOD":
      return <HodDashboard counts={counts} />;
    case "TEACHER":
      return <TeacherDashboard counts={counts} />;
    case "HR":
      return <HrDashboard counts={counts} />;
    case "STUDENT":
      return <StudentDashboard />;
    case "PARENT":
      return <ParentDashboard />;
    default:
      return <SuperAdminDashboard counts={counts} instituteId={instituteId} />;
  }
}
