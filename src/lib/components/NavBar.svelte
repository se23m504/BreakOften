<script lang="ts" context="module">
  export const themes = ["light", "dark", "auto"] as const
  //   export type Theme = (typeof themes)[number]
</script>

<script lang="ts">
  // import {browser} from '$app/environment'
  import { applyAction, enhance } from "$app/forms"
  import { page } from "$app/stores"
  import { slide } from "svelte/transition"
  import type { Theme } from "../../hooks.server"
  let { theme } = $props<{ theme: Theme }>()

  // const deriveNextTheme = (theme: Theme): Theme => {
  // 	switch (theme) {
  // 		case 'dark':
  // 			return 'light'
  // 		case 'light':
  // 			return 'dark'
  // 		case 'auto':
  // 		default:
  // 			if (!browser) return 'auto'
  // 			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'
  // 	}
  // }
  // $derived nextTheme = deriveNextTheme($theme)

  function toggleTheme() {
    const currentIndex = themes.indexOf(theme)
    theme = themes[(currentIndex + 1) % themes.length]
    if (theme == "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "light"
        : "dark"
    }
    console.log(theme)
  }

  let icon = $derived.by(() => {
    if (theme === "light") return "🌞"
    if (theme === "dark") return "🌙"
    if (theme === "auto")
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "🌙"
        : "🌞"
  })
</script>

<header class="flex items-center justify-between px-2 py-4">
  <div class="flex items-center">
    <a href="/" class="px-4 text-xl font-semibold">BreakOften</a>
  </div>

  <nav class="flex items-center gap-4">
    <button class="py-2 px-4"> Login </button>

    <form
      method="POST"
      action="/?/theme"
      use:enhance={async () => {
        return async ({ result }) => {
          await applyAction(result)
        }
      }}
    >
      <input name="theme" value={theme} hidden />
      {#key theme}
        <button transition:slide={{ axis: "x" }} onclick={toggleTheme}>
          {icon}
        </button>
      {/key}
    </form>
  </nav>
</header>
