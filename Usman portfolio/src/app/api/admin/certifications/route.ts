import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

export async function GET() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await sql`SELECT * FROM certifications ORDER BY display_order ASC`
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, org, date, verify_url, display_order } = await request.json()
    await sql`
      INSERT INTO certifications (name, org, date, verify_url, display_order)
      VALUES (${name}, ${org}, ${date}, ${verify_url}, ${display_order ?? 0})
    `
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, name, org, date, verify_url, display_order } = await request.json()
    await sql`
      UPDATE certifications SET name = ${name}, org = ${org}, date = ${date}, verify_url = ${verify_url}, display_order = ${display_order ?? 0}
      WHERE id = ${id}
    `
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    await sql`DELETE FROM certifications WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 })
  }
}
