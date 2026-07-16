import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { sql } from './db'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production')
const COOKIE_NAME = 'admin_session'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.userId as string
  } catch {
    return null
  }
}

export async function getUserFromSession(): Promise<{ id: string; email: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null

    const userId = await verifyToken(token)
    if (!userId) return null

    const rows = await sql`SELECT id, email FROM users WHERE id = ${userId}` as { id: string; email: string }[]
    return rows.length > 0 ? rows[0] : null
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<{ name: string; value: string; options: Record<string, unknown> }> {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  }
}

export async function clearSessionCookie(): Promise<{ name: string; value: string; options: Record<string, unknown> }> {
  return {
    name: COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
    },
  }
}

export { COOKIE_NAME }
