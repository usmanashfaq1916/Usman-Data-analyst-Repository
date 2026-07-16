import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { verifyPassword, createToken, setSessionCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const rows = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = rows[0] as { id: string; email: string; password_hash: string }
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createToken(user.id)
    const cookie = await setSessionCookie(token)

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookie.name, cookie.value, cookie.options)

    return response
  } catch {
    return NextResponse.json({ error: 'Network error. Please try again.' }, { status: 500 })
  }
}
