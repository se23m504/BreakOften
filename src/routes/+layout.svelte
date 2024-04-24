<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte"
  import type { Theme } from "../hooks.server"
  import { browser } from "$app/environment"

  import "../app.css"

  let { data } = $props()

  let theme = $state("" as Theme)

  $effect(() => {
    // browser && (document.documentElement.dataset.theme = theme)
    // browser && (document.documentElement.dataset.theme = theme === "auto" ? "dark" : theme)
  })
</script>

<div>
  <NavBar bind:theme />

  <slot />
</div>

<style lang="postcss">
  :global(body) {
    @apply flex min-h-screen;
  }

  div {
    @apply flex-1;
    @apply flex flex-col;
    @apply bg-background text-foreground;
  }
</style>
