<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte"
  import { browser } from "$app/environment"

  import "../app.css"

  import type { Theme } from "$lib/components/ThemePicker.svelte"
  import type { User } from "$lib"

  let { data } = $props()

  let user = $state(data.user as User)

  let theme = $state("" as Theme)

  $effect(() => {
    user = data.user
    // browser && (document.documentElement.dataset.theme = theme)
  })
</script>

<div>
  <NavBar bind:theme bind:user />

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
