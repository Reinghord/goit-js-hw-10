const BASIC_URL = `https://restcountries.com/v3.1/name`;
const FILTER_RESPONSE = `fields=name,capital,population,flags,languages`;

export default function fetchCountries(name) {
  if (name) {
    return fetch(`${BASIC_URL}/${name}?${FILTER_RESPONSE}`);
  }
}
