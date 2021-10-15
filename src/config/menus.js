/* eslint-disable import/prefer-default-export */
export const menus = {

  registration: 'Welcome to Mamlaka Foods \nSelect Option:\n1. Register',
  register: {
    firstname: 'Enter your first name\n',
    lastname: 'Enter your last name\n',
    idNumber: 'What is your ID number\n',
    gender: 'What is the gender\n1. Male\n2. Female',
    password: 'Enter your password',
    confirmPassword: 'Confirm your password',
    role: 'Who are you?\n1. Farmer\n2. Buyer\n3. DEAN',
  },
  login: {
    password: 'Enter your password',

  },
  farmer: {
    updateLocation: '1. Update Location\n',
    addFarmDetails: '2. Add Farm Details\n',
    addProduct: '3. Add product\n',
    updateDetails: '4. Update farmer details\n',
  },
  farmDetails: {
    farmname: 'Enter farm name',
    farmlocation: 'Enter farm location',
    category: 'Choose a category of foods that you grow\n',
    products: 'Choose a product that you grow\n',
    capacity: 'What is a capacity per harvest in bags',
    success: 'Farmer registered successfully',

  },
  updateFarmerDetails: {
    variety: 'Enter the variety of produce that you grow',
    bags: 'Enter the number of bags per harvest',
    landsize: 'What is the total size of land that you own?',
    kra: 'What is your KRA PIN?',
    equipment: 'What sort of equipment do you own',
    returnLevels: 'What is your produce return levels?',
    landownership: 'Do you own land (Yes/No)',
    businessRegStatus: 'Do you have a business?(Yes/No)',
    groupMembership: 'Are you a part of any group?',
    productionCost: 'What is your total production cost per season?',
    success: 'Farmer details updated successfully',

  },
  addProduct: {
    grades: {
      1: '1. Grade A',
      2: '2. Grade B',
      3: '3. Grade C',
      4: '4. Grade D',
      5: '5. Grade E',
    },
    quantity: 'Enter the quantity of ',
    grade: 'How would you grade your produce?\n',
    success: 'Product added successfully',
  },
  updateLocation: {
    region: 'Select region\n',
    county: 'Select county\n',
    subcounty: 'Select subcounty\n',
    location: 'Select location\n',
    area: 'Enter your area',
    success: 'Location Updated',

  },
  errorMessage: 'Error!',
  footer: '\n 98. Home 99.Back',
  submitDetails: 'Submit details?\n 1.Yes',

};
