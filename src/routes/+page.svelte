<script context="module">
    export async function load() {
        const res = await fetch("https://api.example.com/data");
        const data = await res.json();
        return {
            props: {
                data,
            },
        };
    }
</script>

<script>
    export let data;

    import { goto } from "$app/navigation";
    import { writable } from "svelte/store";

    const startApp = () => {
        goto("/timer");
    };

    const theme = writable("dark");
</script>

<main>
    <h1>Welcome to the Prevent Computer Vision Syndrome App</h1>
    <button on:click={startApp}>Start Timer</button>
</main>

<style lang="postcss">
    main {
        text-align: center;
        margin: 100px auto;
        color: var(--text-color);
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 20px;
    }

    button {
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
    }
</style>
