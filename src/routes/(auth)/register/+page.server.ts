import { fail, redirect } from "@sveltejs/kit"
import { setError, superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"
import * as z from "zod"
import bcrypt from "bcrypt"

import type { Actions } from "./$types"
import { db } from "$lib/server/database"

export const load = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/")
  }

  return {
    signUpForm: await superValidate(zod(signUpSchema)),
  }
}

const signUpSchema = z.object({
  username: z
    .string()
    .min(6)
    .max(128)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username may only contain letters, numbers, hyphens, and underscores"
    ),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{"':;?/><.,\|]).{8,}$/,
      "Password requires at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
})

export let actions: Actions = {
  register: async ({ request }) => {
    const form = await superValidate(request, zod(signUpSchema))
    if (!form.valid) {
      return fail(400, { form })
    }

    const username = form.data.username
    const password = form.data.password

    const user = await db.user.findUnique({
      where: { username },
    })

    if (user) {
      setError(form, "username", "Username already exists")
      return fail(400, { form })
    }

    await db.user.create({
      data: {
        username,
        passwordHash: await bcrypt.hash(password, 10),
        userAuthToken: crypto.randomUUID(),
      },
    })

    throw redirect(303, "/login")
  },
}
