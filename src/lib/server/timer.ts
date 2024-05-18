
export const updateTimer = async ({ user, breakInterval, miniBreakDuration, longBreakDuration, soundEnabled, notificationsEnabled }) => {
    await db.timer.update({
      where: { user_id: user.id },
      data: {
        breakInterval,
        miniBreakDuration,
        longBreakDuration,
        soundEnabled,
        notificationsEnabled,
      },
    })
}