export const goToHome = (str, keyword = '0') => {
  const strArray = str.split('*');
  console.log('Str array for home', strArray);

  let newStr = str;

  for (let i = strArray.length; i >= 0; i -= 1) {
    if (strArray[i] === keyword) {
      newStr = strArray.slice(i + 1).join('*');
      console.log('After slice', newStr);
      // remove everything preceding keyword (keyword included)

      break;
    }
  }

  return newStr;
};
export const goBack = (str, keyword = '00') => {
  const strArray = str.split('*');
  let newStrArray = [];

  for (let i = 0; i < strArray.length; i += 1) {
    if (strArray[i] === keyword) {
      newStrArray = newStrArray.slice(0, -1); // remove the string coming before the keyword
    } else {
      newStrArray = [
        ...newStrArray,
        strArray[i],
      ];
    }
  }

  return newStrArray.join('*');
};

export const routing = (str, goToHomeKeyword, goBackKeyword) => {
  if (goToHomeKeyword === 0) { goToHomeKeyword = '0'; }
  if (goBackKeyword === 0) { goBackKeyword = '00'; }
  return goBack(goToHome(str, goToHomeKeyword), goBackKeyword);
};