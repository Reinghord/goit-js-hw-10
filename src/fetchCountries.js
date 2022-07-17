const BASIC_URL = `https://restcountries.com/v3.1/name`;
const FILTER_RESPONSE = `fields=name,capital,population,flags,languages`;

//Export fetchCountries
//Will create fetch only if name is not an empty string

export default function fetchCountries(name) {
  if (name) {
    return fetch(`${BASIC_URL}/${name}?${FILTER_RESPONSE}`).then(
      onSuccessFetch
    );
  }
}

//fetch will throw error if 404
//otherwise fetch will parse response
function onSuccessFetch(response) {
  if (!response.ok) {
    throw new Error(response.status);
  }
  return response.json();
}
