import axios from 'axios';

const offers = [
  {
    id: '10',
    product: 'Tomatoes',
    farmName: 'Now Farm',
    grade: 'GRADE A',
    availableUnits: '94',
    unitPrice: '51',
    groupPrice: '37',
  },
  {
    id: '2',
    product: 'Tomatoes',
    farmName: 'Now Farm',
    grade: 'GRADE A',
    availableUnits: '94',
    unitPrice: '51',
    groupPrice: '37',
  },
];  

console.log(offers.filter((item) => item.id === '10'));