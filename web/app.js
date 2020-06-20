const API_ENDPOINT = '/api.php';
const ALERT_TIMEOUT = 2000;

const model = {
  dates: [],
};

const controller = {
  init: async function () {
    await view.init();
    this.configAxios();
    this.fetchData();
  },

  configAxios: function () {
    axios.interceptors.response.use(null, (ex) => {
      const message = ex.response
        ? `${i18next.t('unExpectedError')}: ${ex.response.data}`
        : `${i18next.t('unExpectedError')}`;
      view.showError(message);
      return Promise.reject(ex);
    });
  },

  fetchData: async function () {
    const response = await axios.get(API_ENDPOINT);
    model.dates = response.data;
    view.refreshDates();
  },

  rmDate: async function (date) {
    await axios.post(API_ENDPOINT, { rmDate: date });
    this.fetchData();
  },

  addDate: async function () {
    const newDateEl = document.getElementById('newDate');
    const newDate = newDateEl.value;
    newDateEl.value = '';

    if (model.dates.includes(newDate)) {
      view.showError('Data já selecionada.');
      return;
    }

    await axios.post(API_ENDPOINT, { addDate: newDate });
    this.fetchData();
  },
};

const view = {
  init: async function () {
    await this.initI18n();
    this.addListeners();
    this.forbidPastPick();
    this.setStrings();
  },

  initI18n: function () {
    return i18next
      .use(i18nextHttpBackend)
      .use(i18nextBrowserLanguageDetector)
      .on('languageChanged', lang => {
        document.documentElement.setAttribute('lang', lang);
      })
      .init({ fallbackLng: 'en' });
  },

  addListeners: function () {
    const form = document.getElementById('newDate-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      controller.addDate();
    });

    const newDate = document.getElementById('newDate');
    newDate.addEventListener('change', function () {
      const submit = document.getElementById('newDate-submit');
      submit.disabled = newDate.value === '';
    });

    document.addEventListener('click', this.removeError);
  },

  forbidPastPick: function () {
    const today = new Date().toISOString().substr(0, 10);
    document.getElementById('newDate').setAttribute('min', today);
  },

  setStrings: function () {
    document.getElementById('brand').innerHTML = i18next.t('brand');
    document.getElementById('title').innerHTML = i18next.t('disabledDays');
    document.getElementById('newDate-submit').innerHTML = i18next.t('addDate');
  },

  refreshDates: function () {
    const { dates } = model;
    const list = document.getElementById('dates');

    if (dates.length === 0) {
      list.innerHTML = i18next.t('noDates');
      return;
    }

    list.innerHTML = '';
    for (let date of dates) {
      const item = document.createElement('li');
      item.classList =
        'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
      item.innerHTML = `${this.friendlyDate(date)}
        <button class="trash btn btn-link" onclick="controller.rmDate('${date}');" >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>`;

      list.appendChild(item);
    }
  },

  showError: function (message) {
    const alerts = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.classList = 'alert alert-danger';
    alert.innerHTML = message;
    alerts.appendChild(alert);
  },

  removeError: function () {
    const alerts = document.getElementById('alerts');
    if (alerts.innerHTML != '') alerts.innerHTML = '';
  },

  friendlyDate: function (date) {
    return new Date(date + 'T00:00:00').toLocaleDateString(i18next.language, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  },
};

controller.init();
