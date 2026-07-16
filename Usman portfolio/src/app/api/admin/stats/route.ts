import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

export async function GET() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [contactsRes, unreadRes, projectsRes, certsRes, categoriesRes] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM contacts`,
    sql`SELECT COUNT(*) as count FROM contacts WHERE read = false`,
    sql`SELECT COUNT(*) as count FROM projects`,
    sql`SELECT COUNT(*) as count FROM certifications`,
    sql`SELECT COUNT(*) as count FROM skill_categories`,
  ])

  return NextResponse.json({
    totalContacts: Number(contactsRes[0]?.count ?? 0),
    unreadContacts: Number(unreadRes[0]?.count ?? 0),
    totalProjects: Number(projectsRes[0]?.count ?? 0),
    totalCertifications: Number(certsRes[0]?.count ?? 0),
    totalSkillCategories: Number(categoriesRes[0]?.count ?? 0),
  })
}
