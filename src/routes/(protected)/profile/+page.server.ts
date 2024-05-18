import { redirect, type ServerLoadEvent } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

const URL: string = "https://poetrydb.org/author,linecount/Shakespeare;14/lines"

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    throw redirect(302, "/")
  }

  let quote = fetchGuides(event)

  return { quote }
}

async function fetchGuides(event: ServerLoadEvent) {
  const res = await event.fetch(URL)
  const data = await res.json()

  if (res.ok) {
    let num = Math.floor(Math.random() * data.length)
    return data[num]["lines"]
  }
}
