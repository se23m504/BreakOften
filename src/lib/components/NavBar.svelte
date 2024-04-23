<script lang="ts">
  import { applyAction, enhance } from "$app/forms"
  import ThemePicker from "./ThemePicker.svelte"
  import type { Theme } from "../../hooks.server"

  let { theme } = $props<{ theme: Theme }>()
</script>

<header class="flex items-center justify-between px-2 py-4">
  <div class="flex items-center">
    <a href="/" class="px-4 text-xl font-semibold">BreakOften</a>
  </div>

  <nav class="flex items-center gap-4">
    <button class="py-2 px-4"> Login </button>

    <ThemePicker bind:theme />
  </nav>
</header>
