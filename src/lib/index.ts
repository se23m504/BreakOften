export type User = {
  username: string
  id: number
}

export const themes = ["light", "dark"] as const

export type Theme = "light" | "dark"
