export const renderOffers = (offers, offersArray, client) => {
  const status = {};
  let offeringText = '';
  offers.forEach((offer) => {
    const userViewOffers = {};

    if (offer.status !== '0') {
      offeringText += `\n${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade} KES ${offer.group_price}`;
      userViewOffers.id = `${offer.id}`;
      userViewOffers.product = `${offer.product_name}`;
      userViewOffers.farmName = `${offer.farm_name}`;
      userViewOffers.grade = `${offer.grade}`;
      userViewOffers.product_id = `${offer.product_id}`;
      userViewOffers.availableUnits = `${offer.available_units}`;
      userViewOffers.groupPrice = `${offer.group_price}`;
      status[offer.id] = 'group';
    }
    offersArray.push(userViewOffers);

    client.set('groupOffersArray', JSON.stringify(offersArray));
  });
  const message = `CON Choose one of the available options to buy. ${offeringText}`;
  return message;
};

export default renderOffers;