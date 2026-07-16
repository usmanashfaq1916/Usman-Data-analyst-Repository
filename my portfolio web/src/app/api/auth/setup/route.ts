import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword, createToken, setSessionCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const existing = await sql`SELECT COUNT(*) as count FROM users`
    if (Number(existing[0]?.count ?? 0) > 0) {
      return NextResponse.json({ error: 'Admin user already exists' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const result = await sql`INSERT INTO users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING id`
    const userId = result[0].id as string

    const token = await createToken(userId)
    const cookie = await setSessionCookie(token)

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookie.name, cookie.value, cookie.options)

    return response
  } catch {
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
  }
}
