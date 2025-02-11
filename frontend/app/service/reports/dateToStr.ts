export const dateToStr = (num: number) => {
  return (new Date(num)).toLocaleDateString('ru-Ru', { timeZone: 'UTC' });
}