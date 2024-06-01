
const DateConversion = (date) => {
  const givenDate = new Date(date);
  const currentDate = new Date();
  const timeDifference = Math.abs(currentDate - givenDate);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

export default DateConversion