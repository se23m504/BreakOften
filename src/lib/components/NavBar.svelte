<script lang="ts">
  import { enhance } from "$app/forms"
  import type { Theme, User } from "$lib"
  import ThemePicker from "./ThemePicker.svelte"
  import { page } from "$app/stores"

  let { theme, user } = $props<{ theme: Theme; user: User }>()

  let links = [
    {
      title: "Timer",
      prefix: "timer",
      pathname: "/timer",
    },
    {
      title: "About",
      prefix: "about",
      pathname: "/about",
    },
  ]
</script>

<nav>
  <a class="home-link" href="/" title={"home"}>
    <img src="./favicon.png" alt="Home" />
  </a>

  <div class="desktop">
    <div class="center-area" />

    <div class="menu">
      {#each links as link}
        <a href={link.pathname}>
          {link.title}
        </a>
      {/each}

      {#if !user}
        {#if $page.url.pathname !== "/login" && $page.url.pathname !== "/register" && $page.url.pathname !== "/"}
          <a href="/login?from={$page.url.pathname}">Login</a>
        {:else}
          <a href="/login">Login</a>
        {/if}
        <a href="/register">Register</a>
      {/if}

      {#if user}
        <a href="/profile">Profile</a>

        <form class="logout" action="/logout" method="POST" use:enhance>
          <button type="submit" class="padding">Log out</button>
        </form>
      {/if}

      <slot name="external-links" />

      <div class="appearance">
        <ThemePicker bind:theme />
      </div>
    </div>
  </div>
</nav>

<style lang="postcss">
  nav {
    position: fixed;
    display: flex;
    top: 0;
    z-index: 100;
    width: 100vw;
    margin: 0 auto;
    @apply bg-backgroundLight;
    font-family: var(--sk-font);
    user-select: none;
    transition: 0.4s var(--quint-out);
    transition-property: transform, background;
    isolation: isolate;
  }

  nav::after {
    content: "";
    position: absolute;
    left: 0;
    top: -4px;
    width: 100%;
    height: 4px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent);
  }

  .current-section {
    display: flex;
    align-items: center;
    font-size: 0.8em;
    margin-left: 0.4em;
  }

  @media (max-width: 800px) {
    nav:not(.visible):not(:focus-within) {
      transform: translate(0, calc(var(--sk-nav-height)));
    }
  }

  .menu {
    position: relative;
    display: flex;
    width: 100%;
  }

  .menu :global(a) {
    line-height: 1;
    margin: 0 0.3em;
    white-space: nowrap;
  }

  .menu :global(a[aria-current="page"]) {
    color: var(--sk-theme-1);
    box-shadow: inset 0 -1px 0 0 var(--sk-theme-1);
  }

  .menu :global(a[aria-current="page"]:hover) {
    text-decoration: none;
  }

  .home-link {
    max-width: max-content;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 1.8rem;
    color: white;
  }

  .home-link img {
    width: 50px;
    height: auto;
  }

  .home-small {
    display: none;
    margin-left: -0.75rem;
  }

  .home-large {
    display: block;
    color: white;
  }

  .home-link :global(strong) {
    color: white;
    font-weight: inherit;
  }

  .mobile-menu {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
  }

  .desktop {
    display: none;
  }

  nav :global(.small) {
    display: block;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    display: flex;
    gap: 1.5rem;
    padding: 0 1rem;
    line-height: 1;
  }

  .padding {
    padding: 0 0.5rem;
  }

  .search {
    padding-left: 2rem;
  }

  .appearance {
    display: flex;
    align-items: center;
    margin-left: 0.75rem;
    padding-right: 2rem;
  }

  .appearance .caption {
    display: none;
    font-size: var(--sk-text-xs);
    line-height: 1;
    margin-right: 0.5rem;
  }

  @media (min-width: 800px) {
    nav {
      display: grid;
      grid-template-columns: auto 1fr 1fr;
    }

    nav::after {
      top: auto;
      bottom: -4px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent);
    }

    .menu {
      display: flex;
      width: auto;
      height: 100%;
      align-items: center;
      padding: 0 var(--sk-page-padding-side) 0 0;
      justify-content: end;
    }

    .mobile {
      display: none;
    }

    .desktop {
      display: contents;
    }

    nav :global(.small) {
      display: none;
    }
  }

  @media (min-width: 1240px) {
    nav {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
    }
  }

  .icon {
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    -o-object-fit: contain;
    object-fit: contain;
    -webkit-transform-origin: center center;
    transform-origin: center center;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
</style>
