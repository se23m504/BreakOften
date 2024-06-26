<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { browser } from "$app/environment"
  import { enhance } from "$app/forms"

  let { data } = $props()

  let BREAK_INTERVAL_STORE: any = $state(20)
  let MINI_BREAK_DURATION_STORE: any = $state(20)
  let LONG_BREAK_DURATION_STORE: any = $state(5)
  let SOUND_ENABLED: any = $state(true)
  let NOTIFICATIONS_ENABLED: any = $state(true)

  $effect(() => {
    if (!data.user || !data.timer) {
      BREAK_INTERVAL_STORE = browser
        ? localStorage.getItem("breakInterval") || 20
        : 20
      MINI_BREAK_DURATION_STORE = browser
        ? localStorage.getItem("miniBreakDuration") || 20
        : 20
      LONG_BREAK_DURATION_STORE = browser
        ? localStorage.getItem("longBreakDuration") || 5
        : 5
      SOUND_ENABLED = browser
        ? (localStorage.getItem("soundEnabled") || "true") === "true"
        : true
      NOTIFICATIONS_ENABLED = browser
        ? (localStorage.getItem("notificationsEnabled") || "true") === "true"
        : true
    } else {
      BREAK_INTERVAL_STORE = data.timer.breakInterval
      MINI_BREAK_DURATION_STORE = data.timer.miniBreakDuration
      LONG_BREAK_DURATION_STORE = data.timer.longBreakDuration
      SOUND_ENABLED = data.timer.soundEnabled
      NOTIFICATIONS_ENABLED = data.timer.notificationsEnabled
    }
  })

  let BREAK_INTERVAL: number
  let MINI_BREAK_DURATION: number
  let LONG_BREAK_DURATION: number

  let timer: number | null = null

  let timerState = $state("Ready")
  let timeLeftDisplay = $state("")
  let timeLeft = $state(0)

  const updateTimer = () => {
    if (!data.user) {
      return
    }
    const formData = new FormData()
    formData.append("user", data.user)
    formData.append("break-interval", BREAK_INTERVAL_STORE)
    formData.append("mini-break-duration", MINI_BREAK_DURATION_STORE)
    formData.append("long-break-duration", LONG_BREAK_DURATION_STORE)
    formData.append("sound-enabled", SOUND_ENABLED)
    formData.append("notifications-enabled", NOTIFICATIONS_ENABLED)

    fetch("?/updateTimer", {
      method: "POST",
      body: formData,
    })
  }

  $effect(() => {
    BREAK_INTERVAL = BREAK_INTERVAL_STORE * 60 * 1000
    timeLeft = BREAK_INTERVAL
    timeLeftDisplay = formatTime(BREAK_INTERVAL)
    localStorage.setItem("breakInterval", BREAK_INTERVAL_STORE)
    updateTimer()
  })

  $effect(() => {
    MINI_BREAK_DURATION = MINI_BREAK_DURATION_STORE * 1000
    localStorage.setItem("miniBreakDuration", MINI_BREAK_DURATION_STORE)
    updateTimer()
  })

  $effect(() => {
    LONG_BREAK_DURATION = LONG_BREAK_DURATION_STORE * 60 * 1000
    localStorage.setItem("longBreakDuration", LONG_BREAK_DURATION_STORE)
    updateTimer()
  })

  $effect(() => {
    localStorage.setItem("soundEnabled", SOUND_ENABLED)
    updateTimer()
  })

  $effect(() => {
    localStorage.setItem("notificationsEnabled", NOTIFICATIONS_ENABLED)
    updateTimer()
  })

  let miniBreakCount = 0

  let audio: HTMLAudioElement | null = null

  const playSound = () => {
    if (SOUND_ENABLED && audio) {
      audio.pause()
      audio.src = "/sounds/Bells.mp3"
      audio.volume = 0.4
      audio.play()
    }
  }

  const showNotification = (title: string, options: NotificationOptions) => {
    if (NOTIFICATIONS_ENABLED) {
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
      const newTimeLeft = timeLeft - 1000
      if (newTimeLeft <= 0) {
        if (timerState !== "Ready") {
          timerState = "Ready"
          miniBreakCount++
          timeLeftDisplay = formatTime(BREAK_INTERVAL)
          showNotification("Ready", { body: "Continue working!" })
          playSound()
          timeLeft = BREAK_INTERVAL
          return
        }
        if (miniBreakCount === 3) {
          timerState = "Long Break"
          miniBreakCount = 0
          timeLeftDisplay = formatTime(LONG_BREAK_DURATION)
          showNotification("Long Break", {
            body: `Take a ${LONG_BREAK_DURATION / (60 * 1000)}-second break now!`,
          })
          playSound()
          timeLeft = LONG_BREAK_DURATION
          return
        } else {
          timerState = "Mini Break"
          timeLeftDisplay = formatTime(MINI_BREAK_DURATION)
          showNotification("Mini Break", {
            body: `Take a ${MINI_BREAK_DURATION / 1000}-second break now!`,
          })
          playSound()
          timeLeft = MINI_BREAK_DURATION
          return
        }
      }
      timeLeftDisplay = formatTime(newTimeLeft)
      timeLeft = newTimeLeft
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
    if (timerState === "Ready") {
      return
    }
    timerState = "Ready"
    timeLeft = BREAK_INTERVAL
    timeLeftDisplay = formatTime(BREAK_INTERVAL)
  }

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
</script>

<main>
  {#if !browser}
    <div class="loading-spinner" />
  {:else}
    <div class="container">
      <div class="settings">
        <form method="POST" action="?/updateTimer" use:enhance>
          <div class="setting">
            <label for="break-interval"
              >Break interval: {BREAK_INTERVAL_STORE} minutes</label
            >
            <input
              type="range"
              id="break-interval"
              name="break-interval"
              min="1"
              max="60"
              step="1"
              bind:value={BREAK_INTERVAL_STORE}
            />
          </div>

          <div class="setting">
            <label for="mini-break-duration"
              >Mini break duration: {MINI_BREAK_DURATION_STORE} seconds</label
            >
            <input
              id="mini-break-duration"
              name="mini-break-duration"
              type="range"
              min="5"
              max="60"
              step="1"
              bind:value={MINI_BREAK_DURATION_STORE}
            />
          </div>

          <div class="setting">
            <label for="long-break-duration"
              >Long break duration: {LONG_BREAK_DURATION_STORE} minutes</label
            >
            <input
              id="long-break-duration"
              name="long-break-duration"
              type="range"
              min="1"
              max="30"
              step="1"
              bind:value={LONG_BREAK_DURATION_STORE}
            />
          </div>

          <div class="setting">
            <label>
              <input
                id="sound-enabled"
                name="sound-enabled"
                type="checkbox"
                bind:checked={SOUND_ENABLED}
              />
              Sound
            </label>
          </div>

          <div class="setting">
            <label>
              <input
                id="notifications-enabled"
                name="notifications-enabled"
                type="checkbox"
                bind:checked={NOTIFICATIONS_ENABLED}
              />
              Notifications
            </label>
          </div>
        </form>
      </div>
    </div>

    <div class="container">
      <h1>Prevent CVS</h1>

      <div class="timer">
        {#if timerState !== "Ready"}
          <div class="timer-content">
            <p class="state">{timerState}</p>
            <p>Time left until end of break: {timeLeftDisplay}</p>
            <button on:click={skipBreak}>Skip break</button>
          </div>
        {:else}
          <p>Time left until break: {timeLeftDisplay}</p>
        {/if}
      </div>
    </div>
  {/if}
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

  .timer,
  .settings {
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
