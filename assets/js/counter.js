const token = $.cookie('access_token');
const MAALA_SIZE = 108;
let totalCount = 0;
const themes = {
  default: { body: '#0f1724', card: 'rgba(15, 23, 36, 0.9)', text: '#f8fafc', selectBg: '#0f1724', selectText: '#f8fafc' },
  day: { body: '#f2f7fb', card: 'rgba(255,255,255,0.95)', text: '#0f1724', selectBg: '#f2f7fb', selectText: '#0f1724' },
  yellowish: { body: 'rgba(255, 255, 0, 0.5)', card: '#8b4513', text: '#f8f1c2', selectBg: '#1c1a08', selectText: '#f8f1c2' },
  bluish: { body: 'rgb(187, 211, 239)', card: 'rgba(4, 32, 68, 0.9)', text: '#d6e8ff', selectBg: '#081a2f', selectText: '#d6e8ff' },
  greenish: { body: 'rgb(188, 243, 214)', card: '#198754', text: '#d8f6e2', selectBg: '#061b10', selectText: '#d8f6e2' },
};

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

  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      applyTheme(this.value);
    });
    applyTheme(themeSelect.value || 'default');
  }

  if (token || true) getCounter();
  else window.location.href = $('#login-url').prop('href');
});

function applyTheme(name) {
  const theme = themes[name] || themes.default;
  document.body.style.backgroundColor = theme.body;
  document.body.style.color = theme.text;

  const counterCard = document.getElementById('counter');
  if (counterCard) {
    counterCard.style.backgroundColor = theme.card;
    counterCard.style.borderColor = theme.selectText;
    counterCard.style.color = theme.text;
  }

  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.style.backgroundColor = theme.selectBg;
    themeSelect.style.color = theme.selectText;
  }

  // Ensure buttons contrast properly on 'day' theme (light card)
  const dayChecks = ['resetBtn', 'naamInput', 'increment', 'incrementStep'];

  dayChecks.forEach(id => {
    const elem = document.getElementById(id);
    if (name === 'day') {
      if (elem) {
        elem.style.backgroundColor = 'transparent';
        elem.style.color = theme.text;
        elem.style.borderColor = theme.text;
        elem.classList.remove("bg-black");
        elem.classList.remove("text-light");
      }
      
    } else {
      // clear inline styles so bootstrap classes control appearance
      if (elem) {
        elem.style.backgroundColor = '';
        elem.style.color = '';
        elem.style.borderColor = '';
        elem.classList.add("bg-black");
        elem.classList.add("text-light");
      }
    }
  });

  
}

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

