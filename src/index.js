import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const { searchInput, renderData } = {
  searchInput: document.querySelector('#search-box'),
  renderData: document.querySelector('.country-info'),
};

searchInput.addEventListener(
  'input',
  debounce(e => {
    const searchText = e.target.value.trim();

    // onInputClear(searchText);
    if (Boolean(searchText) === false) {
      return markupClear();
    }

    fetchCountries(searchText)
      .then(onSuccessFetch)
      .then(createMarkup)
      .catch(onError);
  }, DEBOUNCE_DELAY)
);

function onError() {
  Notify.failure('Oops, there is no country with that name');
}

function markupClear() {
  renderData.innerHTML = '';
}

// function onInputClear(input) {
//   if (Boolean(input) === false) {
//     return markupClear();
//   }
// }

function onSuccessFetch(response) {
  return response.json();
}

function createMarkup(data) {
  if (data.length > 10) {
    onDataMoreTen();
  } else if (data.length < 10 && data.length >= 2) {
    onDataLessTenMoreTwo(data);
  } else {
    onDataEqualOne(data);
  }

  function onDataMoreTen() {
    markupClear();
    Notify.info('Too many matches found. Please enter a more specific name.');
  }

  function onDataLessTenMoreTwo(data) {
    markupClear();
    const markup = data.map(object => {
      return `<p style="font-size: 16px"><img src="${object.flags.svg}" alt="flag" width="50" height"50" /> ${object.name.official}</p>`;
    });
    renderData.insertAdjacentHTML('beforeend', markup.join(''));
  }

  function onDataEqualOne(data) {
    markupClear();
    renderData.innerHTML = `
          <p style="font-size: 36px"><img src="${
            data[0].flags.svg
          }" alt="flag" width="50" height"50" /> ${data[0].name.official}</p>
        <p><b>Capital:</b> ${data[0].capital}</p>
        <p><b>Population:</b> ${data[0].population}</p>
        <p><b>Languages:</b> ${Object.values(data[0].languages)}</p>`;
  }
}
