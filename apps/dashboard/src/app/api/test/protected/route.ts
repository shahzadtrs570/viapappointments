/*eslint-disable import/order*/

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@package/auth"

// This is a protected route that requires authentication
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    status: "authenticated",
    user: session.user,
  })
}
