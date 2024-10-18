export interface IDate {
  day: string
  time: string
}

export const formatDate = (string: string): IDate => {
  const dateObj = new Date(string)
  const day = dateObj.toLocaleDateString('en-EN', {
    day: '2-digit',
    month: 'long',
  })
  const time = dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  return { day, time }
}
