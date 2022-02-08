const usernameValidation = (text, index) => {
  const username = text.split('*')[`${index}`];
  const regex = /^[a-zA-Z]*$/;
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  } if (!regex.test(username)) {
    return 'Username must only contain letters and no spaces';
  }
  return 'valid';
};
export const IdValidation = (text) => {
  const id = text.split('*')[2];
  const regex = /^[0-9]*$/;
  if (id.length < 8) {
    return 'ID number must be at least 8 characters';
  }
  if (!regex.test(id)) {
    return 'ID number must only contain numbers';
  }
  return 'valid';
};
export const numberValidation = (text, index) => {
  const number = text.split('*')[`${index}`];
  const regex = /^\d+$/;
  if (!regex.test(number)) {
    return 'Choose option 1 or 2';
  }
  return 'valid';
};

export const numberWithinRange = (text, index) => {
  const number = text.split('*')[`${index}`];
  const regex = /^\d+$/;
  if (!regex.test(number)) {
    return 'Out of range! Choose only numbers listed';
  }
  return 'valid';
};
export default usernameValidation;