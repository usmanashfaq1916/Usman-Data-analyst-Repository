import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const data = await sql`SELECT * FROM projects ORDER BY display_order ASC`
  return NextResponse.json(data)
}
