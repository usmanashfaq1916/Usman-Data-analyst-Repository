"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Admission {
  id: string
  applicationId: string
  studentName: string
  programId: string
  status: string
  createdAt: string
}

interface CampusDist {
  name: string
  students: number
}

export interface DashboardData {
  totalStudents: number
  totalTeachers: number
  totalCampuses: number
  totalAdmissions: number
  programCount: number
  activeAdmissions?: number
  recentAdmissions: Admission[]
  campusDistribution: CampusDist[]

  enrolledCourses?: number
  attendance?: number
  fee?: number
  gpa?: number

  activeClasses?: number
  weeklyHours?: number
  avgAttendance?: number

  children?: number
  avgGpa?: number
  feeStatus?: string
}

export function useDashboardData() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const role = (session?.user?.role as string) || "STUDENT"

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/dashboard?role=${role}`)
        if (res.ok) {
          const json = await res.json()
          setData(json)
          setError(null)
        } else {
          setError("Failed to fetch dashboard data")
        }
      } catch {
        setError("Failed to connect to server")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [role])

  return { data, loading, error }
}
