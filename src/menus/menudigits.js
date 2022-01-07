const generateKeys = (obj) => {
  let menuNumbers;
  obj.forEach((value, index) => {
    menuNumbers = {
      [index]: value.id,
    };
  });
  return menuNumbers;
};

export default generateKeys;
