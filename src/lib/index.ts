export type User = {
  username: string
}

export const themes = ["light", "dark"] as const

export type Theme = "light" | "dark"
