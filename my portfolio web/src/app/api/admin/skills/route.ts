import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

export async function GET() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await sql`SELECT * FROM skill_categories ORDER BY display_order ASC`
  const skills = await sql`SELECT * FROM skills ORDER BY display_order ASC`

  const result = categories.map((cat: Record<string, any>) => ({
    ...cat,
    skills: skills.filter((s: Record<string, any>) => s.category_id === cat.id),
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { type, title, icon, display_order, category_id, name, level } = await request.json()

    if (type === 'category') {
      await sql`
        INSERT INTO skill_categories (title, icon, display_order)
        VALUES (${title}, ${icon || 'Code2'}, ${display_order ?? 0})
      `
    } else {
      await sql`
        INSERT INTO skills (category_id, name, level, display_order)
        VALUES (${category_id}, ${name}, ${level ?? 50}, ${display_order ?? 0})
      `
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { type, id, title, icon, display_order, name, level } = await request.json()

    if (type === 'category') {
      await sql`
        UPDATE skill_categories SET title = ${title}, icon = ${icon}, display_order = ${display_order ?? 0}
        WHERE id = ${id}
      `
    } else {
      await sql`
        UPDATE skills SET name = ${name}, level = ${level ?? 50}, display_order = ${display_order ?? 0}
        WHERE id = ${id}
      `
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { type, id } = await request.json()
    if (type === 'category') {
      await sql`DELETE FROM skill_categories WHERE id = ${id}`
    } else {
      await sql`DELETE FROM skills WHERE id = ${id}`
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
