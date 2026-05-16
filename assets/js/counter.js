const token = $.cookie('access_token');
const MAALA_SIZE = 108;
let totalCount = 0;

$('#counter-form').hide();

$(document).ready(async function() {
  document.getElementById('incrementBtn').addEventListener('click', function() {
    changeCount(1);
  });

  document.getElementById('resetBtn').addEventListener('click', function() {
    totalCount = 0;
    updateDisplay();
  });

  document.getElementById('increment').addEventListener('input', function() {
    const value = Number(this.value) || 0;
    const cycleValue = Math.max(0, Math.min(value, MAALA_SIZE));
    const completedMaala = Number(document.getElementById('completedMaala').textContent) || 0;
    totalCount = completedMaala * MAALA_SIZE + cycleValue;
    updateDisplay();
  });

  if (token || true) getCounter();
  else window.location.href = $('#login-url').prop('href');
});

function changeCount(delta) {
  totalCount = Math.max(0, totalCount + delta);
  updateDisplay();
}

function updateDisplay() {
  const completedMaala = Math.floor(totalCount / MAALA_SIZE);
  const currentCycle = totalCount % MAALA_SIZE;
  const remaining = currentCycle === 0 ? MAALA_SIZE : MAALA_SIZE - currentCycle;

  document.getElementById('completedMaala').textContent = completedMaala;
  document.getElementById('remainingCount').textContent = remaining;
  document.getElementById('increment').value = currentCycle;
}

async function getCounter() {
  $('#counter-form').show();
  const settings = {
    url: 'https://api.goodhuman.in/counter',
    method: 'GET',
    timeout: 0,
    headers: {
      Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': window.location.origin,
    },
  };

  $.ajax(settings).done(function(response) {
    console.log(response);
    updateDisplay();
  });
}

async function putCounter() {
  $('#saveCounterBtn').prop('disabled', true);
  const settings = {
    url: 'https://api.goodhuman.in/counter',
    method: 'PUT',
    timeout: 0,
    headers: {
      Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': window.location.origin,
    },
    data: JSON.stringify({ name: $('#incrementBy').val() }),
  };

  $.ajax(settings).done(function(response) {
    $('#saveCounterBtn').prop('disabled', false);
    getCounter();
  });
}

