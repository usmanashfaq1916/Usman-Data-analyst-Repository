import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      select: { province: true, type: true },
    });

    const applications = await prisma.application.findMany({
      select: { status: true },
    });

    const admissions = await prisma.admission.findMany({
      select: { status: true },
    });

    const provinceMap = new Map<string, number>();
    const typeMap = new Map<string, number>();
    const appStatusMap = new Map<string, number>();
    const admissionStatusMap = new Map<string, number>();

    for (const u of universities) {
      provinceMap.set(u.province, (provinceMap.get(u.province) || 0) + 1);
      typeMap.set(u.type, (typeMap.get(u.type) || 0) + 1);
    }

    for (const a of applications) {
      appStatusMap.set(a.status, (appStatusMap.get(a.status) || 0) + 1);
    }

    for (const a of admissions) {
      admissionStatusMap.set(a.status, (admissionStatusMap.get(a.status) || 0) + 1);
    }

    return NextResponse.json({
      universitiesByProvince: Array.from(provinceMap.entries()).map(([name, value]) => ({ name, value })),
      universitiesByType: Array.from(typeMap.entries()).map(([name, value]) => ({ name, value })),
      admissionsByStatus: Array.from(admissionStatusMap.entries()).map(([name, value]) => ({ name, value })),
      applicationsByStatus: Array.from(appStatusMap.entries()).map(([name, value]) => ({ name, value })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
