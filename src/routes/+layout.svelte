<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte"
  import ThemePicker, { type Theme } from "$lib/components/ThemePicker.svelte"

  import "../app.css"

  // let lastTheme: string | null = null
  // if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
  //   lastTheme = localStorage.getItem("theme") || "dark"
  // }

  let { data } = $props()

  let theme = $state(data.theme as Theme)
</script>

<div data-theme={theme}>
  <!-- <ThemePicker bind:theme /> -->
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
