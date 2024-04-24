<script lang="ts">
  let { data } = $props()
</script>

<main>
  <div>
    {#if data.user}
      <p>Welcome @{data.user.name}!</p>
      <p>Enjoy some Shakespeare!</p>
    {/if}
    {#await data.quote}
      <div class="loading-spinner"></div>
    {:then quote}
      <div
        class="quote-container bg-gray-100 border border-gray-300 p-6 rounded-lg"
      >
        <blockquote class="font-semibold mb-2 text-background">
          "
          {#each quote as link, i}
            {#if i === 0}
              {link}
            {:else}
              <br />{link}
            {/if}
          {:else}
            There was an error fetching the quote.
          {/each}
          "
        </blockquote>
      </div>
    {/await}
  </div>
</main>

<style lang="postcss">
  main {
    @apply text-center;
    @apply mx-auto my-32;
  }

  h1 {
    @apply text-4xl mb-8;
  }

  p {
    @apply mb-6;
  }

  .quote-container {
    @apply bg-gray-100;
    @apply border border-gray-300;
    @apply rounded-lg;
    @apply p-6;
    @apply max-w-xl;
    @apply mx-auto;
  }

  blockquote {
    @apply text-lg font-semibold text-black;
    @apply mb-2;
    @apply break-words;
  }

  button {
    @apply inline-block;
    @apply rounded px-4 py-2;
    @apply transition duration-300 ease-in-out;
    @apply bg-primary text-white;
  }

  button:hover {
    @apply bg-primaryLight text-white;
  }

  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #3498db;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    animation: spin 1s linear infinite;
    @apply max-w-xl;
    @apply mx-auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
