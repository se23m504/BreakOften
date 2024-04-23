<script context="module">
  export async function load() {
    const res = await fetch("https://api.example.com/data")
    const data = await res.json()
    return {
      props: {
        data,
      },
    }
  }
</script>

<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { writable } from "svelte/store"
  import type { Writable } from "svelte/store"

  const MINI_BREAK_DURATION = 0.15 * 60 * 1000 // 1 minutes
  // const MINI_BREAK_DURATION = 20 * 60 * 1000; // 20 minutes
  const MINI_BREAK_INTERVAL = 5 * 1000 // 20 seconds
  // const LONG_BREAK_DURATION = 5 * 60 * 1000; // 5 minutes
  const LONG_BREAK_DURATION = 0.3 * 60 * 1000 // 2 minutes

  let timer: number | null = null
  let miniBreakCount = 0

  let audio: HTMLAudioElement | null = null

  const playSound = () => {
    if (audio) {
      // audio.pause();
      audio.src = "/sounds/Bells.mp3"
      audio.volume = 0.4
      // audio.play();
    }
  }

  const showNotification = (title: string, options: NotificationOptions) => {
    if (Notification.permission === "granted") {
      // new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // new Notification(title, options);
        }
      })
    }
  }

  const state: Writable<string> = writable("Ready")
  const timeLeftDisplay: Writable<string> = writable("")
  const timeLeft: Writable<number> = writable(MINI_BREAK_DURATION)

  const startTimer = () => {
    if (timer) clearInterval(timer)

    timer = setInterval(() => {
      timeLeft.update((currentTimeLeft) => {
        const newTimeLeft = currentTimeLeft - 1000
        if (newTimeLeft <= 0) {
          if ($state !== "Ready") {
            state.set("Ready")
            miniBreakCount++
            timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION))
            showNotification("Ready", { body: "Continue working!" })
            playSound() // Adjust volume as needed
            return MINI_BREAK_DURATION
          }
          if (miniBreakCount === 3) {
            state.set("Long Break")
            miniBreakCount = 0
            timeLeftDisplay.set(formatTime(LONG_BREAK_DURATION))
            showNotification("Long Break", {
              body: "Take a 5-minute break now!",
            })
            playSound() // Adjust volume as needed
            return LONG_BREAK_DURATION
          } else {
            state.set("Mini Break")
            // miniBreakCount++;
            timeLeftDisplay.set(formatTime(MINI_BREAK_INTERVAL))
            showNotification("Mini Break", {
              body: "Take a 20-second break now!",
            })
            playSound() // Adjust volume as needed
            return MINI_BREAK_INTERVAL
          }
        }
        timeLeftDisplay.set(formatTime(newTimeLeft))
        return newTimeLeft
      })
    }, 1000)
  }

  onMount(() => {
    audio = document.createElement("audio")
    startTimer()
  })

  onDestroy(() => {
    if (timer) clearInterval(timer)
    if (audio) audio = null
  })

  const skipBreak = () => {
    // if (timer) clearInterval(timer);
    if ($state === "Ready") {
      return
    }
    state.set("Ready")
    timeLeft.set(MINI_BREAK_DURATION)
    timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION))
    // startTimer();
  }

  const postponeBreak = () => {
    // if (timer) clearInterval(timer);
    state.set("Ready")
    // setTimeout(startTimer, 2 * MINI_BREAK_INTERVAL); // Postpone for 2 mini-break intervals
    timeLeft.set(MINI_BREAK_DURATION) // Corrected line
    timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION)) // Use MINI_BREAK_INTERVAL directly
  }

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    console.log(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    )

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
</script>

<main>
  <div>
    <h1>Prevent CVS</h1>
    {#if $state !== "Ready"}
      <p>{$state}</p>
      <p>Time left until end of break: {$timeLeftDisplay}</p>
    {:else}
      <p>Time left until break: {$timeLeftDisplay}</p>
    {/if}
    {#if $state !== "Ready"}
      <button on:click={skipBreak}>Skip Break</button>
    {/if}
  </div>
</main>

<style lang="postcss">
  main {
    @apply text-center;
    @apply mx-auto my-64;
  }

  h1 {
    @apply text-4xl mb-8;
  }

  p {
    @apply text-base mb-4;
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
</style>
