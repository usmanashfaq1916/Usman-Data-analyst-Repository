import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

export async function GET() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await sql`SELECT id, name, email, message, created_at, read FROM contacts ORDER BY created_at DESC`
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, read } = await request.json()
    await sql`UPDATE contacts SET read = ${read} WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    await sql`DELETE FROM contacts WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
