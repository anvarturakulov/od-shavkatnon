export const dateToStr = (num: number | null) => {
  if (num) {
    return (new Date(num)).toLocaleDateString('ru-Ru', { timeZone: 'UTC' });
  }
}