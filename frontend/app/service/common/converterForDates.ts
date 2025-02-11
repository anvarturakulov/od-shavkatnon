export const dateNumberToString = (dateInNumber:number): string => {
  let dateStart = dateInNumber > 0 ?
    new Date(dateInNumber) :
    new Date();

  return dateStart.toISOString().split('T')[0]
}

