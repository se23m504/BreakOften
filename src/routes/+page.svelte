<main>
  <h1>Welcome to BreakOften!</h1>
  <a href="/timer">Start Timer</a>
</main>

<style lang="postcss">
main {
    @apply text-center;
    @apply mx-auto my-64;
  }

  h1 {
    @apply text-4xl mb-8;
  }

  a {
    @apply inline-block;
    @apply rounded px-4 py-2;
    @apply transition duration-300 ease-in-out;
    @apply bg-primary text-white;
  }

  a:hover {
    @apply bg-primaryLight text-white;
  }
</style>
