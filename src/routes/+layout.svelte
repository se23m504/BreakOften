<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte"
  import type { Theme, User } from "$lib"
  import "../app.css"

  let { data } = $props()

  let user = $state(data.user as User)

  let theme = $state("" as Theme)

  $effect(() => {
    user = data.user
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
