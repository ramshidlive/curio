export function getEditionDate(timezone = process.env.CURIO_TIMEZONE || 'UTC') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(
    new Date(),
  )
}
