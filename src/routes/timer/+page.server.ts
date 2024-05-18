import { redirect, type ServerLoadEvent } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { db } from "$lib/server/database"
import type { User } from "$lib/index"

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return
  }

  let timer = await fetchTimer(event.locals.user)

  return { timer }
}

async function fetchTimer(user: User) {
  let timer = await db.timer.findUnique({ where: { user_id: user.id } })

  if (!timer) {
    await db.timer.create({
      data: {
        user_id: user.id,
      },
    })
  }

  return await db.timer.findUnique({ where: { user_id: user.id } })
}

export const actions = {
  updateTimer: async ({ request, locals }) => {
    const user = locals.user
    const data = await request.formData()
    console.log(data)
    const breakInterval = parseInt(data.get("break-interval"))
    const miniBreakDuration = parseInt(data.get("mini-break-duration"))
    const longBreakDuration = parseInt(data.get("long-break-duration"))
    const soundEnabled = data.get("sound-enabled") === "true"
    const notificationsEnabled = data.get("notifications-enabled") === "true"

    await db.timer.update({
      where: { user_id: user.id },
      data: {
        breakInterval,
        miniBreakDuration,
        longBreakDuration,
        soundEnabled,
        notificationsEnabled,
      },
    })
  }
}
