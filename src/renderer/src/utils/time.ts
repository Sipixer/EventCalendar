function formatHeure(heure, minute) {
  const heureFormatee = heure.toString().padStart(2, '0')
  const minuteFormatee = minute.toString().padStart(2, '0')
  return `${heureFormatee}:${minuteFormatee}`
}
function formatDureeEnMinutes(dureeEnMinutes) {
  const heuresFormatees = Math.floor(dureeEnMinutes / 60)
    .toString()
    .padStart(2, '0')
  const minutesFormatees = (dureeEnMinutes % 60).toString().padStart(2, '0')
  return `${heuresFormatees}:${minutesFormatees}`
}

export { formatHeure, formatDureeEnMinutes }
