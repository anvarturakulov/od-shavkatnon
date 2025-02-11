export const getDateFromStorageExceptNull = (date: string | null | undefined): string => {
  let data = date != null ? new Date(`${date}`) : new Date()
  return data.toISOString().split('T')[0]
}