const removeCommaFromCurrencyValue = (value) => {
  let currencyValue = value.replaceAll(',', '');
  return Number(currencyValue);
};

module.exports = {
  removeCommaFromCurrencyValue,
};
