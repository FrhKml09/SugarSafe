import { getHistory, replaceAllHistory } from './storage'
import { getGlucoseReadings, replaceAllGlucoseReadings } from './glucoseStorage'
import { getHabitEntries, replaceAllHabitEntries } from './habitStorage'
import { getProfile, saveProfile } from './profileStorage'

const BACKUP_VERSION = 1

export function buildBackup() {
  return {
    app: 'SugarSafe',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    history: getHistory(),
    glucoseReadings: getGlucoseReadings(),
    habitEntries: getHabitEntries(),
    profile: getProfile(),
  }
}

export function downloadBackup() {
  const data = buildBackup()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const dateStr = new Date().toISOString().slice(0, 10)

  const link = document.createElement('a')
  link.href = url
  link.download = `sugarsafe-backup-${dateStr}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function restoreBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      let data
      try {
        data = JSON.parse(reader.result)
      } catch {
        reject(new Error("That file doesn't look like a valid SugarSafe backup."))
        return
      }

      if (!data || typeof data !== 'object' || data.app !== 'SugarSafe') {
        reject(new Error("That file doesn't look like a valid SugarSafe backup."))
        return
      }

      if (Array.isArray(data.history)) replaceAllHistory(data.history)
      if (Array.isArray(data.glucoseReadings)) replaceAllGlucoseReadings(data.glucoseReadings)
      if (Array.isArray(data.habitEntries)) replaceAllHabitEntries(data.habitEntries)
      if (data.profile) saveProfile(data.profile)

      resolve(data)
    }

    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsText(file)
  })
}
