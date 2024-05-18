import type { Handle } from "@sveltejs/kit"
import { db } from "$lib/server/database"

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get("session")

  if (!session) {
    return await resolve(event)
  }

  const user = await db.user.findUnique({
    where: { userAuthToken: session },
    select: { username: true, id: true },
  })

  if (user) {
    event.locals.user = {
      name: user.username,
      id: user.id,
    }
  }

  return await resolve(event)
}
