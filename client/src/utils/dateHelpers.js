// -> yyyy-mm-dd
export const convertToHTMLDate = (input) => {
  const dateObj = new Date(input);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  console.log(date);
  const output = [
    year,
    month > 9 ? month : '0' + month,
    date > 9 ? date : '0' + date
  ].join('-');
  console.log('htmldate', output);
  return output;
}

// -> hh:mm
export const convertToHTMLTime = (input) => {
  const dateObj = new Date(input);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const output = [
    hours > 9 ? hours : '0' + hours,
    minutes > 9 ? minutes : '0' + minutes
  ].join(':');
  console.log('htmltime', output);
  return output;
}