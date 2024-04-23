<script lang="ts" context="module">
  export const themes = ["light", "dark", "auto"] as const
</script>

<script lang="ts">
  import { slide } from "svelte/transition"
  import type { Theme } from "../../hooks.server"
  import { applyAction, enhance } from "$app/forms"
  let { theme } = $props<{ theme: Theme }>()

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
