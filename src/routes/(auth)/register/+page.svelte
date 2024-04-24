<script lang="ts">
  import { enhance } from "$app/forms"

  export let form
</script>

<form action="?/register" method="POST" use:enhance>
  <div>
    <label for="username">Username</label>
    <input id="username" name="username" type="text" required />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required />
  </div>

  {#if form?.user}
    <p class="error">Username is taken.</p>
  {/if}

  <button type="submit">Register</button>
</form>

<style lang="postcss">
  form {
    @apply mx-auto p-10 pt-10 border border-gray-300 rounded-lg bg-gradient-to-br from-blue-200 to-blue-100 text-gray-800 shadow-lg;
    max-width: 400px;
    margin-top: 14rem;
  }

  label {
    @apply block mb-3 font-semibold text-gray-800;
  }

  input[type="text"],
  input[type="password"] {
    @apply w-full py-2 px-4 mb-4 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:border-blue-500;
    transition: all 0.3s ease;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    @apply border-blue-500 shadow-md;
  }

  .error {
    @apply text-red-500 mt-4;
  }

  button {
    @apply w-full py-2 px-4 mb-4 border border-gray-300 rounded-lg text-gray-800 bg-white focus:border-blue-500;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  button:hover {
    @apply text-background border-background;
  }
</style>
