<script lang="ts">
  import { browser } from "$app/environment"
  import { themes, type Theme } from "$lib"

  let { theme } = $props<{ theme: Theme }>()

  theme =
    (browser && (document.documentElement.dataset.theme as Theme)) || "dark"

  function toggleTheme() {
    const currentIndex = themes.indexOf(theme)
    theme = themes[(currentIndex + 1) % themes.length]
    if (browser) {
      localStorage.setItem("theme", theme)
      document.documentElement.dataset.theme = theme
    }
  }

  let icon = $derived(theme)
</script>

{#key theme}
  <button
    on:click={toggleTheme}
    type="button"
    aria-pressed={icon === "dark" ? "true" : "false"}
  >
    {#if browser}
      <span class="check" class:checked={icon === "dark"}>
        <span class="icon">
          {#if icon === "dark"}
            {@render DarkModeIcon()}
          {:else}
            {@render LightModeIcon()}
          {/if}
        </span>
      </span>
    {/if}
  </button>
{/key}

{#snippet DarkModeIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    ><path
      fill="currentColor"
      d="M12 21q-3.775 0-6.388-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.625-.075.975.45t-.025 1.1q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.525-.35 1.075-.037t.475.987q-.35 3.45-2.937 5.725T12 21Zm0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19Zm-.25-6.75Z"
    />
  </svg>
{/snippet}

{#snippet LightModeIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    ><g
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      ><path d="M0 0h24v24H0z" /><path
        fill="currentColor"
        d="M12 19a1 1 0 0 1 .993.883L13 20v1a1 1 0 0 1-1.993.117L11 21v-1a1 1 0 0 1 1-1zm6.313-2.09l.094.083l.7.7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.218-1.567l.102.07zm-11.306.083a1 1 0 0 1 .083 1.32l-.083.094l-.7.7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0zM4 11a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11h1zm17 0a1 1 0 0 1 .117 1.993L21 13h-1a1 1 0 0 1-.117-1.993L20 11h1zM6.213 4.81l.094.083l.7.7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7A1 1 0 0 1 6.11 4.74l.102.07zm12.894.083a1 1 0 0 1 .083 1.32l-.083.094l-.7.7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0zM12 2a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1zm0 5a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7z"
      />
    </g>
  </svg>
{/snippet}

<style lang="postcss">
  button {
    position: relative;
    border-radius: 11px;
    display: block;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
    @apply border border-solid border-foreground border-opacity-30;
    transition: border-color 0.25s;
  }

  button:hover {
    @apply text-foreground border-foreground;
  }

  .check {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    @apply bg-background text-foreground;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 1px 2px rgba(0, 0, 0, 0.06);
    transition: transform 0.25s;
    pointer-events: none;
  }

  .check.checked {
    transform: translate(18px);
  }

  .icon {
    position: relative;
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    overflow: hidden;
  }

  .icon :global(svg) {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
  }
</style>
