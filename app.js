const API_ENDPOINT = '/api.php';

const getDates = async () => {
  const response = await fetch(API_ENDPOINT);
  return response.json();
};

const populateDates = async () => {
  const datesEl = document.getElementById('dates');
  const dates = await getDates();

  if (dates.length === 0) {
    datesEl.innerHTML = 'Nenhuma data.';
    return;
  }

  datesEl.innerHTML = '';
  for (let date of dates) {
    const el = document.createElement('li');
    el.classList =
      'list-group-item d-flex justify-content-between align-items-center';
    el.innerHTML = `${date}
      <button class="trash btn btn-link" onclick="rmDate('${date}');" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </button>`;

    datesEl.appendChild(el);
  }
};

const rmDate = async date => {
  await fetch(API_ENDPOINT, {
    method: 'post',
    body: JSON.stringify({ rmDate: date })
  });
  populateDates();
};

const addDate = async () => {
  const newDate = document.getElementById('newDate').value;

  await fetch(API_ENDPOINT, {
    method: 'post',
    body: JSON.stringify({ addDate: newDate })
  });
  populateDates();
};

populateDates();

const today = new Date().toISOString().substr(0, 10);
document.getElementById('newDate').setAttribute('min', today);
