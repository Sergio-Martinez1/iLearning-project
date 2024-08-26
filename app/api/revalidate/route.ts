import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  revalidatePath("/dashboard")
  return Response.json({ revalidated: true, now: Date.now() })

  //return Response.json({
  //  revalidated: false,
  //  now: Date.now(),
  //  message: 'Missing path to revalidate',
  //})
}
