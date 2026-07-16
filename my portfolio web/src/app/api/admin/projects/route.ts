import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromSession } from '@/lib/auth'

export async function GET() {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await sql`SELECT * FROM projects ORDER BY display_order ASC`
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, problem, dataset, tools, solution, insights, results, code, demo, locallink, screenshot, display_order } = await request.json()

    await sql`
      INSERT INTO projects (title, problem, dataset, tools, solution, insights, results, code, demo, locallink, screenshot, display_order)
      VALUES (${title}, ${problem}, ${dataset}, ${JSON.stringify(tools || [])}, ${solution}, ${JSON.stringify(insights || [])}, ${results}, ${code}, ${demo}, ${locallink}, ${screenshot}, ${display_order ?? 0})
    `

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, title, problem, dataset, tools, solution, insights, results, code, demo, locallink, screenshot, display_order } = await request.json()

    await sql`
      UPDATE projects SET
        title = ${title}, problem = ${problem}, dataset = ${dataset}, tools = ${JSON.stringify(tools || [])},
        solution = ${solution}, insights = ${JSON.stringify(insights || [])}, results = ${results},
        code = ${code}, demo = ${demo}, locallink = ${locallink}, screenshot = ${screenshot},
        display_order = ${display_order ?? 0}, updated_at = now()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getUserFromSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    await sql`DELETE FROM projects WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
