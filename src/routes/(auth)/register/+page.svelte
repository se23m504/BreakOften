<script lang="ts">
  import { superForm } from "sveltekit-superforms"

  let { data } = $props()
  let { form, errors, enhance } = superForm(data.signUpForm)
</script>

<form action="?/register" method="POST" use:enhance>
  <label for="username">Username</label>
  <input name="username" type="text" bind:value={$form.username} />
  {#if $errors.username}
    <p class="error">{$errors.username}</p>
  {/if}

  <label for="password">Password</label>
  <input name="password" type="password" bind:value={$form.password} />
  {#if $errors.password}
    <p class="error">{$errors.password}</p>
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
    @apply text-red-500 mb-4;
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
