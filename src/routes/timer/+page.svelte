<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { writable } from "svelte/store"
  import type { Writable } from "svelte/store"

  const BREAK_INTERVAL_STORE: Writable<number> = writable(0.2)
  const MINI_BREAK_DURATION_STORE: Writable<number> = writable(20)
  const LONG_BREAK_DURATION_STORE: Writable<number> = writable(5)
  const SOUND_ENABLED: Writable<boolean> = writable(true)
  const NOTIFICATIONS_ENABLED: Writable<boolean> = writable(true)

  let BREAK_INTERVAL: number
  let MINI_BREAK_DURATION: number
  let LONG_BREAK_DURATION: number
  let SOUND_ENABLED_STATE: boolean
  let NOTIFICATIONS_ENABLED_STATE: boolean

  let timer: number | null = null

  const state: Writable<string> = writable("Ready")
  const timeLeftDisplay: Writable<string> = writable("")
  const timeLeft: Writable<number> = writable($BREAK_INTERVAL_STORE)

  BREAK_INTERVAL_STORE.subscribe((value) => {
    BREAK_INTERVAL = value * 60 * 1000
    timeLeft.set(BREAK_INTERVAL)
    timeLeftDisplay.set(formatTime(BREAK_INTERVAL))
  })
  MINI_BREAK_DURATION_STORE.subscribe((value) => (MINI_BREAK_DURATION = value * 1000))
  LONG_BREAK_DURATION_STORE.subscribe((value) => (LONG_BREAK_DURATION = value * 60 * 1000))
  SOUND_ENABLED.subscribe((value) => (SOUND_ENABLED_STATE = value))
  NOTIFICATIONS_ENABLED.subscribe((value) => (NOTIFICATIONS_ENABLED_STATE = value))

  let miniBreakCount = 0

  let audio: HTMLAudioElement | null = null

  const playSound = () => {
    if (SOUND_ENABLED_STATE && audio) {
      audio.pause()
      audio.src = "/sounds/Bells.mp3"
      audio.volume = 0.4
      audio.play()
    }
  }

  const showNotification = (title: string, options: NotificationOptions) => {
    if (NOTIFICATIONS_ENABLED_STATE) {
      if (Notification.permission === "granted") {
        new Notification(title, options)
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, options)
          }
        })
      }
    }
  }

  const startTimer = () => {
    if (timer) clearInterval(timer)

    timer = setInterval(() => {
      timeLeft.update((currentTimeLeft) => {
        const newTimeLeft = currentTimeLeft - 1000
        if (newTimeLeft <= 0) {
          if ($state !== "Ready") {
            state.set("Ready")
            miniBreakCount++
            timeLeftDisplay.set(formatTime(BREAK_INTERVAL))
            showNotification("Ready", { body: "Continue working!" })
            playSound()
            return BREAK_INTERVAL
          }
          if (miniBreakCount === 3) {
            state.set("Long Break")
            miniBreakCount = 0
            timeLeftDisplay.set(formatTime(LONG_BREAK_DURATION))
            showNotification("Long Break", {
              body: `Take a ${LONG_BREAK_DURATION / (60 * 1000)}-second break now!`,

            })
            playSound()
            return LONG_BREAK_DURATION
          } else {
            state.set("Mini Break")
            timeLeftDisplay.set(formatTime(MINI_BREAK_DURATION))
            showNotification("Mini Break", {
              body: `Take a ${MINI_BREAK_DURATION / 1000}-second break now!`,
            })
            playSound()
            return MINI_BREAK_DURATION
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
    if ($state === "Ready") {
      return
    }
    state.set("Ready")
    timeLeft.set(BREAK_INTERVAL)
    timeLeftDisplay.set(formatTime(BREAK_INTERVAL))
  }

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
</script>

<main>
  <div class="container">
    <div class="settings">
      <h1>Prevent CVS</h1>

      <div class="setting">
        <label for="break-interval">Break interval: {BREAK_INTERVAL / (60 * 1000)} minutes</label>
        <input type="range" min="1" max="60" step="1" bind:value={$BREAK_INTERVAL_STORE} />
      </div>

      <div class="setting">
        <label for="mini-break-duration">Mini break duration: {MINI_BREAK_DURATION / 1000} seconds</label>
        <input type="range" min="5" max="60" step="1" bind:value={$MINI_BREAK_DURATION_STORE} />
      </div>

      <div class="setting">
        <label for="long-break-duration">Long break duration: {LONG_BREAK_DURATION / (60 * 1000)} minutes</label>
        <input type="range" min="1" max="30" step="1" bind:value={$LONG_BREAK_DURATION_STORE} />
      </div>

      <div class="setting">
        <label>
          <input type="checkbox" bind:checked={$SOUND_ENABLED} />
          Sound
        </label>
      </div>

      <div class="setting">
        <label>
          <input type="checkbox" bind:checked={$NOTIFICATIONS_ENABLED} />
          Notifications
        </label>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="timer">
      {#if $state !== "Ready"}
        <div class="timer-content">
          <p class="state">{$state}</p>
          <p>Time left until end of break: {$timeLeftDisplay}</p>
          <button on:click={skipBreak}>Skip break</button>
        </div>
      {:else}
        <p>Time left until break: {$timeLeftDisplay}</p>
      {/if}
    </div>
  </div>

</main>

<style lang="postcss">
  main {
    @apply text-center;
    @apply mx-auto my-64;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    align-items: center;
  }

  h1 {
    @apply text-4xl mb-8;
    @apply font-bold text-primary;
  }

  .container {
    @apply bg-white rounded-lg shadow-lg p-8;
    position: relative;
  }

  .timer, .settings {
    @apply text-black;
  }

  .setting {
    @apply mb-2;
  }

  p {
    @apply text-base mb-4;
    @apply text-black;
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

  .state {
    @apply text-2xl font-semibold text-red-500;
  }
</style>
