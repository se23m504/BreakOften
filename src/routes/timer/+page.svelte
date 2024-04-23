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

<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { Sound } from "svelte-sound";
  import click_mp4 from "../../assets/Bells.mp3";

  const MINI_BREAK_DURATION = 0.15 * 60 * 1000; // 1 minutes
  // const MINI_BREAK_DURATION = 20 * 60 * 1000; // 20 minutes
  const MINI_BREAK_INTERVAL = 5 * 1000; // 20 seconds
  // const LONG_BREAK_DURATION = 5 * 60 * 1000; // 5 minutes
  const LONG_BREAK_DURATION = 0.3 * 60 * 1000; // 2 minutes

  let timer: number | null = null;
  let miniBreakCount = 0;

  const click_sound = new Sound(click_mp4);
  const playSound = () => {
    // click_sound.play();
  };

  const showNotification = (title: string, options: NotificationOptions) => {
    if (Notification.permission === "granted") {
      // new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // new Notification(title, options);
        }
      });
    }
  };

  const state: Writable<string> = writable("Ready");
  const timeLeftDisplay: Writable<string> = writable("");
  const timeLeft: Writable<number> = writable(MINI_BREAK_DURATION);

  const startTimer = () => {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      timeLeft.update((currentTimeLeft) => {
        const newTimeLeft = currentTimeLeft - 1000;
        if (newTimeLeft <= 0) {
          if ($state !== "Ready") {
            state.set("Ready");
            miniBreakCount++;
            timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION));
            showNotification("Ready", { body: "Continue working!" });
            playSound(); // Adjust volume as needed
            return MINI_BREAK_DURATION;
          }
          if (miniBreakCount === 3) {
            state.set("Long Break");
            miniBreakCount = 0;
            timeLeftDisplay.set(formatTime(LONG_BREAK_DURATION));
            showNotification("Long Break", {
              body: "Take a 5-minute break now!",
            });
            playSound(); // Adjust volume as needed
            return LONG_BREAK_DURATION;
          } else {
            state.set("Mini Break");
            // miniBreakCount++;
            timeLeftDisplay.set(formatTime(MINI_BREAK_INTERVAL));
            showNotification("Mini Break", {
              body: "Take a 20-second break now!",
            });
            playSound(); // Adjust volume as needed
            return MINI_BREAK_INTERVAL;
          }
        }
        timeLeftDisplay.set(formatTime(newTimeLeft));
        return newTimeLeft;
      });
    }, 1000);
  };

  onMount(() => {
    startTimer();
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  const skipBreak = () => {
    // if (timer) clearInterval(timer);
    if ($state === "Ready") {
      return;
    }
    state.set("Ready");
    timeLeft.set(MINI_BREAK_DURATION);
    timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION));
    // startTimer();
  };

  const postponeBreak = () => {
    // if (timer) clearInterval(timer);
    state.set("Ready");
    // setTimeout(startTimer, 2 * MINI_BREAK_INTERVAL); // Postpone for 2 mini-break intervals
    timeLeft.set(MINI_BREAK_DURATION); // Corrected line
    timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION)); // Use MINI_BREAK_INTERVAL directly
  };

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    console.log(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    );

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="max-w-md p-6 bg-white rounded-md shadow-md">
    <h1 class="text-3xl mb-4 font-bold text-center">
      Prevent Computer Vision Syndrome
    </h1>
    <p>{$state}</p>
    {#if $state !== "Ready"}
      <p>Time left until Ready: {$timeLeftDisplay}</p>
    {:else}
      <p>Time left until break: {$timeLeftDisplay}</p>
    {/if}
    {#if $state !== "Ready"}
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        on:click={skipBreak}>Skip Break</button
      >
    {/if}
  </div>
</main>

<!-- 
<style>
  main {
    text-align: center;
    margin: 100px auto;
    color: var(--text-color);
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    margin: 10px;
  }
</style> -->
