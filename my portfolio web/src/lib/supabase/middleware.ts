import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const userId = token ? await verifyToken(token) : null

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPage && userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}
