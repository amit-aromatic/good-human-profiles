const token = $.cookie('access_token');
const MAALA_SIZE = 108;
let totalCount = 0;
let speechLoopActive = false;
let hindiVoice = null;
let hindiVoiceLoadStart = null;
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
    stopSpeechLoop();
  });

  document.getElementById('speechBtn').addEventListener('click', function() {
    if (speechLoopActive) {
      stopSpeechLoop();
    } else {
      startSpeechLoop();
    }
  });

  document.getElementById('increment').addEventListener('input', function() {
    const value = Number(this.value) || 0;
    const cycleValue = Math.max(0, Math.min(value, MAALA_SIZE));
    const completedMaala = Number(document.getElementById('completedMaala').textContent) || 0;
    totalCount = completedMaala * MAALA_SIZE + cycleValue;
    updateDisplay();
  });

  const themeButtons = document.querySelectorAll('#themeButtons button[data-theme]');
  if (themeButtons.length) {
    themeButtons.forEach(button => {
      button.addEventListener('click', function() {
        applyTheme(this.dataset.theme || 'default');
        setActiveThemeButton(this);
      });
    });
    const defaultTheme = 'default';
    applyTheme(defaultTheme);
    setActiveThemeButton(document.querySelector(`#themeButtons button[data-theme="${defaultTheme}"]`));
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

  const themeButtons = document.querySelectorAll('#themeButtons button[data-theme]');
  themeButtons.forEach(button => {
    if (name === 'day') {
      button.classList.remove('btn-outline-light');
      button.classList.add('btn-outline-dark');
    } else {
      button.classList.remove('btn-outline-dark');
      button.classList.add('btn-outline-light');
    }
  });

  // Ensure buttons contrast properly on 'day' theme (light card)
  const dayChecks = ['resetBtn', 'naamInput', 'increment', 'incrementStep', 'speechBtn'];

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

  updateSpeechButtonTheme(name);

  
}

function setActiveThemeButton(activeButton) {
  const buttons = document.querySelectorAll('#themeButtons button[data-theme]');
  buttons.forEach(button => {
    button.classList.toggle('active', button === activeButton);
    button.setAttribute('aria-pressed', button === activeButton ? 'true' : 'false');
  });
}

function changeCount(delta) {
  totalCount = Math.max(0, totalCount + delta);
  updateDisplay();
}

function updateSpeechVoiceStatus(message, classes = 'text-warning') {
  const status = document.getElementById('speechVoiceStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.remove('text-warning', 'text-success', 'text-danger');
  status.classList.add(classes);
}

function startHindiVoiceLoad() {
  hindiVoiceLoadStart = performance.now();
  updateSpeechVoiceStatus('Loading Hindi voice…', 'text-warning');
}

function finishHindiVoiceLoad(found) {
  const elapsed = Math.round(performance.now() - (hindiVoiceLoadStart || performance.now()));
  if (found) {
    updateSpeechVoiceStatus(`Hindi voice loaded in ${elapsed} ms`, 'text-success');
    setTimeout(() => {
      const status = document.getElementById('speechVoiceStatus');
      status.style.display = 'none';
    }, 3000);
  } else {
    updateSpeechVoiceStatus('Hindi voice not available', 'text-danger');
  }
}

function loadHindiVoice() {
  const voices = speechSynthesis.getVoices() || [];
  if (!voices.length) {
    return;
  }

  hindiVoice = voices.find(voice => {
    const lang = (voice.lang || '').toLowerCase();
    const name = (voice.name || '').toLowerCase();
    return /^(hi(-|_)?in?|hindi)/.test(lang) || /hindi/.test(name);
  }) || null;

  finishHindiVoiceLoad(Boolean(hindiVoice));
}

if ('onvoiceschanged' in speechSynthesis) {
  speechSynthesis.onvoiceschanged = loadHindiVoice;
}
startHindiVoiceLoad();
loadHindiVoice();

function startSpeechLoop() {
  const speechBtn = document.getElementById('speechBtn');
  speechLoopActive = true;
  if (speechBtn) {
    updateSpeechButtonLabel(true);
    updateSpeechButtonTheme(getCurrentTheme());
  }
  speakNaam();
}

function stopSpeechLoop() {
  const speechBtn = document.getElementById('speechBtn');
  speechLoopActive = false;
  speechSynthesis.cancel();
  if (speechBtn) {
    updateSpeechButtonLabel(false);
    updateSpeechButtonTheme(getCurrentTheme());
  }
}

function updateSpeechButtonLabel(isSpeaking) {
  const icon = document.getElementById('speechBtnIcon');
  const label = document.getElementById('speechBtnLabel');
  if (!icon || !label) return;

  icon.textContent = isSpeaking ? '⏸️' : '🔊';
  label.textContent = isSpeaking ? 'Pause Speech' : 'Start Speech';
}

function updateSpeechButtonTheme(themeName) {
  const speechBtn = document.getElementById('speechBtn');
  if (!speechBtn) return;

  speechBtn.classList.remove('btn-success', 'btn-danger', 'btn-outline-dark');
  if (speechLoopActive) {
    speechBtn.classList.add('btn-danger');
  } else if (themeName === 'day') {
    speechBtn.classList.add('btn-outline-dark');
  } else {
    speechBtn.classList.add('btn-success');
  }
}

function getCurrentTheme() {
  const activeButton = document.querySelector('#themeButtons button.active');
  return (activeButton && activeButton.dataset.theme) || 'default';
}

function speakNaam() {
  if (!speechLoopActive) {
    return;
  }

  const naamInput = document.getElementById('naamInput');
  const naam = (naamInput && naamInput.value.trim()) || 'Radha';
  if (!naam) {
    stopSpeechLoop();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(naam);
  if (hindiVoice) {
    utterance.voice = hindiVoice;
  } else {
    utterance.lang = 'hi-IN';
  }
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = function() {
    if (!speechLoopActive) {
      return;
    }
    changeCount(1);
    setTimeout(speakNaam, 250);
  };

  utterance.onerror = function() {
    if (speechLoopActive) {
      setTimeout(speakNaam, 500);
    }
  };

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
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

