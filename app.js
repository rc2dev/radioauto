const API_ENDPOINT = '/api.php';
const ALERT_TIMEOUT = 4000;

const data = {
  dates: []
};

const controller = {
  init: function() {
    this.fetchData();
    view.init();
  },

  fetchData: async function() {
    const response = await fetch(API_ENDPOINT);
    data.dates = await response.json();
    view.refreshData();
  },

  rmDate: async function(date) {
    await fetch(API_ENDPOINT, {
      method: 'post',
      body: JSON.stringify({ rmDate: date })
    });
    this.fetchData();
  },

  addDate: async function() {
    const newDate = document.getElementById('newDate').value;

    if (data.dates.includes(newDate)) {
      view.error('Data já selecionada.');
      return;
    }

    await fetch(API_ENDPOINT, {
      method: 'post',
      body: JSON.stringify({ addDate: newDate })
    });
    this.fetchData();
  }
};

const view = {
  init: function() {
    this.forbidPastPick();
  },

  forbidPastPick: function() {
    const today = new Date().toISOString().substr(0, 10);
    document.getElementById('newDate').setAttribute('min', today);
  },

  refreshData: function() {
    const { dates } = data;
    const list = document.getElementById('dates');

    if (dates.length === 0) {
      list.innerHTML = 'Nenhuma data.';
      return;
    }

    list.innerHTML = '';
    for (let date of dates) {
      const item = document.createElement('li');
      item.classList =
        'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `${date}
        <button class="trash btn btn-link" onclick="controller.rmDate('${date}');" >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>`;

      list.appendChild(item);
    }
  },

  error: function(message) {
    const alerts = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.classList = 'alert alert-danger';
    alert.innerHTML = message;
    alerts.appendChild(alert);

    setTimeout(() => {
      alerts.removeChild(alert);
    }, ALERT_TIMEOUT);
  }
};

controller.init();
