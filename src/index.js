//Imports
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

//Default debounce delay
const DEBOUNCE_DELAY = 300;
//Refs
const { searchInput, renderData } = {
  searchInput: document.querySelector('#search-box'),
  renderData: document.querySelector('.country-info'),
};

//Event listener for input
//Using debounce to prevent chatty event
searchInput.addEventListener(
  'input',
  debounce(e => {
    const searchText = e.target.value.trim();

    // onInputClear(searchText);

    //if search text is an empty string, markup will clear and fetch will not execute
    if (!searchText) {
      return markupClear();
    }

    //Fetch for countries
    //onSuccess returns array of object as per searchText
    //Depending on number of object returned, will create corresponding markup
    //On error will display Notify message
    fetchCountries(searchText).then(createMarkup).catch(onError);
  }, DEBOUNCE_DELAY)
);

//Function to display message if catch is executed
function onError() {
  Notify.failure('Oops, there is no country with that name');
}

//Function to clear markup
function markupClear() {
  renderData.innerHTML = '';
}

// function onInputClear(input) {
//   if (Boolean(input) === false) {
//     return markupClear();
//   }
// }

//Function to parse fetch response in json
// function onSuccessFetch(response) {
//   if (!response.ok) {
//     throw new Error(response.status);
//   }
//   return response.json();
// }

//Function to create markup depending on how many objects returned from API
function createMarkup(data) {
  if (data.length > 10) {
    onDataMoreTen();
  } else if (data.length < 10 && data.length >= 2) {
    onDataLessTenMoreTwo(data);
  } else {
    onDataEqualOne(data);
  }
}

//Function to display Notify message if more than 10 objects returned
function onDataMoreTen() {
  markupClear();
  Notify.info('Too many matches found. Please enter a more specific name.');
}

//Function to create markup if amount of objects returned is less than 10 but more or equall 2
function onDataLessTenMoreTwo(data) {
  const markup = data
    .map(object => {
      return `<p style="font-size: 16px"><img src="${object.flags.svg}" alt="flag" width="50" height"50" /> ${object.name.official}</p>`;
    })
    .join('');
  renderData.innerHTML = markup;
}

//Function to create markup if amount of objects returned equal 1
//Using data[0], because we know that response will be an array with only 1 object inside
function onDataEqualOne(data) {
  renderData.innerHTML = `
          <p style="font-size: 36px"><img src="${
            data[0].flags.svg
          }" alt="flag" width="50" height"50" /> ${data[0].name.official}</p>
        <p><b>Capital:</b> ${data[0].capital}</p>
        <p><b>Population:</b> ${data[0].population}</p>
        <p><b>Languages:</b> ${Object.values(data[0].languages)}</p>`;
}
