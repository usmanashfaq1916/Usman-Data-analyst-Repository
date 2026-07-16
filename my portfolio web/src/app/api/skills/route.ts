import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const categories = await sql`SELECT * FROM skill_categories ORDER BY display_order ASC`
  const skills = await sql`SELECT * FROM skills ORDER BY display_order ASC`

  const result = categories.map((cat: Record<string, any>) => ({
    ...cat,
    skills: skills.filter((s: Record<string, any>) => s.category_id === cat.id),
  }))

  return NextResponse.json(result)
}
