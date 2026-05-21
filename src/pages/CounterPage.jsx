import { useEffect, useState } from 'react';
import { SEO } from '../assets/js/constants.js';

const resetBtnClick = function() {
  globalThis.location.reload();
}

export default function CounterPage() {
  document.title = `${SEO.default.title} | Counter`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', "The Good Human counter page for tracking counts, themes, and speech-assisted counting in a personalized dashboard.");
  }
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', "The Good Human counter, counting dashboard, maala counter, speech counter, Hindi voice counter, personalized counter, theme switcher, productivity counter, devotional counter, tracking tool");
  }

  const MAALA_SIZE = 108;
  
  const [totalCount, setTotalCount] = useState(0);
  const [completedMaala, setCompletedMaala] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(-1);
  const [remaining, setRemaining] = useState(MAALA_SIZE);
  const [speechLoopActive, setSpeechLoopActive] = useState(false);

  let hindiVoice = null;
  let hindiVoiceLoadStart = null;
  let backgroundAudioContext = null;
  let backgroundMusicGain = null;
  let backgroundMusicPulseInterval = null;
  const themes = {
    default: { body: '#0f1724', card: 'rgba(15, 23, 36, 0.9)', text: '#f8fafc', selectBg: '#0f1724', selectText: '#f8fafc' },
    day: { body: '#f2f7fb', card: 'rgba(255,255,255,0.95)', text: '#0f1724', selectBg: '#f2f7fb', selectText: '#0f1724' },
    yellowish: { body: 'rgba(255, 255, 0, 0.5)', card: '#8b4513', text: '#f8f1c2', selectBg: '#1c1a08', selectText: '#f8f1c2' },
    bluish: { body: 'rgb(187, 211, 239)', card: 'rgba(4, 32, 68, 0.9)', text: '#d6e8ff', selectBg: '#081a2f', selectText: '#d6e8ff' },
    greenish: { body: 'rgb(188, 243, 214)', card: '#198754', text: '#d8f6e2', selectBg: '#061b10', selectText: '#d8f6e2' },
  };

  const incrementBtnClick = function() {
    changeCount(1);
  }

  useEffect(() => {
    if (speechLoopActive) {
      startSpeechLoop();
    } else {
      stopSpeechLoop();
    }
  }, [speechLoopActive]);

  const incrementOnInput = function(ele) {
    const cycleValue = Math.max(0, Math.min(Number(ele.value) || 0, MAALA_SIZE));
    setTotalCount(completedMaala * MAALA_SIZE + cycleValue);
    updateDisplay();
  }

  function doPageLoadTasks() {

    const themeButtons = document.querySelectorAll('#themeButtons button[data-theme]');
    if (themeButtons.length) {
      themeButtons.forEach(button => {
        button?.addEventListener('click', function() {
          applyTheme(this.dataset.theme || 'default');
          setActiveThemeButton(this);
        });
      });
      const defaultTheme = 'default';
      applyTheme(defaultTheme);
      setActiveThemeButton(document.querySelector(`#themeButtons button[data-theme="${defaultTheme}"]`));
    }

  }

  function applyTheme(name) {
    const theme = themes[name] || themes.default;
    const bodyElem = document.getElementById('counterBody')
    bodyElem.style.backgroundColor = theme.body;
    bodyElem.style.color = theme.text;

    const counterCard = document.getElementById('counter');
    if (counterCard) {
      counterCard.style.backgroundColor = theme.card;
      counterCard.style.borderColor = theme.selectText;
      counterCard.style.color = theme.text;
    }

    const themeButtons = document.querySelectorAll('#themeButtons button[data-theme]');
    themeButtons.forEach(button => {
      button.classList.remove('btn-outline-light', 'btn-outline-dark');
      button.classList.add(name === 'day' ? 'btn-outline-dark' : 'btn-outline-light');
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
          elem.classList.remove('bg-black', 'text-light');
        }
        
      } else {
        // clear inline styles so bootstrap classes control appearance
        if (elem) {
          elem.style.backgroundColor = '';
          elem.style.color = '';
          elem.style.borderColor = '';
          elem.classList.add('bg-black', 'text-light');
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
    let tmpTotalCount = Math.max(0, totalCount + delta);
    setTotalCount(tmpTotalCount)
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
        if (status) status.style.display = 'none';
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
    startBackgroundMusic();
    updateSpeechButtonLabel(true);
    updateSpeechButtonTheme(getCurrentTheme());
    speakNaam();
  }

  function stopSpeechLoop() {
    stopBackgroundMusic();
    updateSpeechButtonLabel(false);
    updateSpeechButtonTheme(getCurrentTheme());
    speechSynthesis.cancel();
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
    return (activeButton?.dataset.theme) || 'default';
  }

  function ensureBackgroundMusic() {
    if (!globalThis.AudioContext && !globalThis.webkitAudioContext) {
      console.warn('Web Audio API not supported in this browser');
      return;
    }
    if (backgroundAudioContext) {
      return;
    }

    backgroundAudioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
    backgroundMusicGain = backgroundAudioContext.createGain();
    backgroundMusicGain.gain.value = 0;
    backgroundMusicGain.connect(backgroundAudioContext.destination);

    const osc = backgroundAudioContext.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 196;
    osc.connect(backgroundMusicGain);
    osc.start();
  }

  function scheduleTannPulse(startTime) {
    const envelope = backgroundMusicGain.gain;
    const peak = 2.6 + Math.random() * 0.8;
    const decay = 1 + Math.random() * 0.5;
    envelope.cancelScheduledValues(startTime);
    envelope.setValueAtTime(0, startTime);
    envelope.linearRampToValueAtTime(peak, startTime + 0.01);
    envelope.exponentialRampToValueAtTime(0.02, startTime + 0.12);
    envelope.setTargetAtTime(0, startTime + 0.18, decay);
  }

  function playTannSequence() {
    if (!backgroundAudioContext || !backgroundMusicGain) {
      return;
    }
    const now = backgroundAudioContext.currentTime;
    scheduleTannPulse(now + 0.1);
    scheduleTannPulse(now + 0.35);
    scheduleTannPulse(now + 0.5);
    scheduleTannPulse(now + 0.65);
    scheduleTannPulse(now + 0.9);
  }

  function startBackgroundMusic() {
    ensureBackgroundMusic();
    if (!backgroundAudioContext || !backgroundMusicGain) {
      return;
    }

    if (backgroundAudioContext.state === 'suspended') {
      backgroundAudioContext.resume();
    }

    playTannSequence();
    if (backgroundMusicPulseInterval) {
      clearInterval(backgroundMusicPulseInterval);
    }
    backgroundMusicPulseInterval = setInterval(playTannSequence, 1800);
  }

  function stopBackgroundMusic() {
    if (backgroundMusicPulseInterval) {
      clearInterval(backgroundMusicPulseInterval);
      backgroundMusicPulseInterval = null;
    }
    if (!backgroundAudioContext || !backgroundMusicGain) {
      return;
    }
    backgroundMusicGain.gain.cancelScheduledValues(backgroundAudioContext.currentTime);
    backgroundMusicGain.gain.setTargetAtTime(0, backgroundAudioContext.currentTime, 0.2);
  }

  function speakNaam() {
    if (!speechLoopActive) {
      return;
    }

    const naamInput = document.getElementById('naamInput');
    const naam = (naamInput?.value.trim()) || 'Radha';
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
    utterance.rate = 0.8;
    utterance.pitch = 0.6;
    utterance.volume = 0.8;

    utterance.onend = function() {
      if (!speechLoopActive) {
        return;
      }
      incrementBtnClick()
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
    const tmpCompletedMaala = Math.floor(totalCount / MAALA_SIZE);
    const tmpCurrentCycle = totalCount % MAALA_SIZE
    const tmpRemaining = currentCycle === MAALA_SIZE ? MAALA_SIZE : MAALA_SIZE - currentCycle;

    setCompletedMaala(tmpCompletedMaala);
    setRemaining(tmpRemaining);
    setCurrentCycle(tmpCurrentCycle)

  }

  useEffect(() => {
    doPageLoadTasks();
    incrementBtnClick();
  }, []);

  return (
    <div className="container text-left" id={"counterBody"} style={{ minWidth: '100%' }}>
      <div className="row p-2 justify-content-center">
        <div id="counter" className="col-12 col-md-6 p-4 bg-opacity-90 rounded-4 border border-secondary">
          <div className="mb-3">
            <label htmlFor="naamInput" className="form-label">Naam being recited</label>
            <input
              type="text"
              value="Radha"
              onChange={resetBtnClick}
              className="form-control bg-black text-light border-secondary"
              id="naamInput"
              list="naamSuggestions"
              placeholder="Enter naam or mantra"
              style={{ fontSize: '1.1rem' }}
            />
            <datalist id="naamSuggestions">
              <option value="Radha"></option>
              <option value="Raam"></option>
              <option value="Saamb sadashiv"></option>
              <option value="ॐ कृष्णाय वासुदेवाय हरये परमात्मने। प्रणतः क्लेशनाशाय गोविन्दाय नमो नमः॥"></option>
              <option value="हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥"></option>
            </datalist>
            {/* <div className="form-text text-secondary mt-2">Suggestions: Radha · Raam · Saamb sadashiv · ॐ कृष्णाय वासुदेवाय हरये परमात्मने। प्रणतः क्लेशनाशाय गोविन्दाय नमो नमः॥ · हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥</div> */}
          </div>
          <div className="mb-3">
            <label className="form-label">Theme</label>
            <div id="themeButtons" className="btn-group d-flex flex-nowrap gap-1" role="group" aria-label="Theme selection">
              <button type="button" className="btn btn-outline-light btn-sm flex-fill active" data-theme="default" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Night</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="day" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Day</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="yellowish" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Yellow</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="bluish" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Blue</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="greenish" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Green</button>
            </div>
          </div>
          <p className="mb-4">Track your recitation. 1 maala = {MAALA_SIZE} repetitions.</p>

          <div className="mb-3">
            <label htmlFor="increment" className="form-label">Current Count</label>
            <div className="input-group input-group-lg">
              <input
                type="number" disabled={true}
                className="form-control bg-black text-light border-secondary"
                id="increment"
                value={currentCycle}
                onInput={(ele) => incrementOnInput(ele)}
                style={{ fontSize: '2rem', textAlign: 'center' }}
              />
              <span className="input-group-text bg-black text-light border-secondary" id="incrementStep">/ {MAALA_SIZE}</span>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <button type="button" className="btn btn-outline-light w-100" id="resetBtn" onClick={resetBtnClick}>Reset</button>
            </div>
            <div className="col-6">
              <button type="button" className="btn btn-light border-secondary w-100" id="incrementBtn" onClick={incrementBtnClick}>+1</button>
            </div>
          </div>
          <div className="row g-2 mb-3">
            <div className="col-12">
              <button type="button" className="btn border-secondary w-100" id="speechBtn" onClick={() => setSpeechLoopActive(!speechLoopActive)}>
                <span id="speechBtnIcon" aria-hidden="true">🔊</span>
                <span id="speechBtnLabel">Start Speech</span>
              </button>
              <div id="speechVoiceStatus" className="form-text text-warning mt-2">Loading Hindi voice…</div>
            </div>
          </div>
          totalCount{totalCount}<br />
          speechLoopActive{Number(speechLoopActive)}
          <div className="d-flex justify-content-between small">
            <div>Completed maala: <span id="completedMaala">{completedMaala}</span></div>
            <div>Remaining: <span id="remainingCount">{(remaining-1) || MAALA_SIZE}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
