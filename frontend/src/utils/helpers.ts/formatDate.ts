export const formatDate = (string: string): string => {
    const date = new Date(string)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const minutesFormat = minutes < 10 ? `0${minutes}` : minutes
    return `${hours}:${minutesFormat}`
  }