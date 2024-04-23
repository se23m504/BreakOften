<script lang="ts">
  import ThemePicker, { type Theme } from "$lib/components/ThemePicker.svelte"
  import "../app.css"

  let { data } = $props()

  let theme = $state("dark" as Theme)
</script>

<div data-theme={theme}>
  <ThemePicker bind:theme />

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
