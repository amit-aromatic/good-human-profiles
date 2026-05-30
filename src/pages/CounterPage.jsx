import { useEffect, useRef, useState } from 'react';
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
  const speechSynthesisRef = globalThis.speechSynthesis;

  const [totalCount, setTotalCount] = useState(0);
  const [completedMaala, setCompletedMaala] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [remaining, setRemaining] = useState(MAALA_SIZE);
  const [speechLoopActive, setSpeechLoopActive] = useState(false);
  const [hindiVoiceStatus, setHindiVoiceStatus] = useState('Loading Hindi voice…');
  const [hindiVoiceStatusClass, setHindiVoiceStatusClass] = useState('text-warning');

  const hindiVoiceRef = useRef(null);
  const hindiVoiceLoadStartRef = useRef(null);
  const backgroundAudioContextRef = useRef(null);
  const backgroundMusicGainRef = useRef(null);
  const speechLoopActiveRef = useRef(false);
  const backgroundMusicPulseIntervalRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const voiceStatusHideTimeoutRef = useRef(null);
  const themeButtonsRef = useRef([]);

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

  function doPageLoadTasks() {
    const themeButtons = document.querySelectorAll('#themeButtons button[data-theme]');
    themeButtonsRef.current = Array.from(themeButtons);
    if (themeButtons.length) {
      themeButtons.forEach(button => {
        button?.addEventListener('click', function() {
          applyTheme(button.dataset.theme || 'default');
          setActiveThemeButton(button);
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
    if (bodyElem) {
      bodyElem.style.backgroundColor = theme.body;
      bodyElem.style.color = theme.text;
    }

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

    const dayChecks = ['resetBtn', 'naamInput', 'increment', 'incrementStep', 'speechBtn'];

    dayChecks.forEach(id => {
      const elem = document.getElementById(id);
      
      if (elem) {
        if (name === 'day') {
          elem.style.backgroundColor = 'transparent';
          elem.style.color = theme.text;
          elem.style.borderColor = theme.text;
          elem.classList.remove('bg-black', 'text-light');
        }
        else {
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
    setTotalCount(tmpTotalCount);
  }

  function updateSpeechVoiceStatus(message, classes = 'text-warning') {
    setHindiVoiceStatus(message);
    setHindiVoiceStatusClass(classes);
  }

  function startHindiVoiceLoad() {
    hindiVoiceLoadStartRef.current = performance.now();
    updateSpeechVoiceStatus('Loading Hindi voice…', 'text-warning');
  }

  function finishHindiVoiceLoad(found) {
    const elapsed = Math.round(performance.now() - (hindiVoiceLoadStartRef.current || performance.now()));
    if (found) {
      updateSpeechVoiceStatus(`Hindi voice loaded in ${elapsed} ms`, 'text-success');
      if (voiceStatusHideTimeoutRef.current) {
        clearTimeout(voiceStatusHideTimeoutRef.current);
      }
      voiceStatusHideTimeoutRef.current = setTimeout(() => {
        setHindiVoiceStatus('');
      }, 3000);
    } else {
      updateSpeechVoiceStatus('Hindi voice not available', 'text-danger');
    }
  }

  function loadHindiVoice() {
    const voices = speechSynthesisRef?.getVoices?.() || [];
    if (!voices.length) {
      return;
    }

    hindiVoiceRef.current = voices.find(voice => {
      const lang = (voice.lang || '').toLowerCase();
      const name = (voice.name || '').toLowerCase();
      return /^(hi(-|_)?in?|hindi)/.test(lang) || /hindi/.test(name);
    }) || null;

    finishHindiVoiceLoad(Boolean(hindiVoiceRef.current));
  }

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
    speechSynthesisRef?.cancel?.();
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
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
    if (speechLoopActiveRef.current) {
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
    if (backgroundAudioContextRef.current) {
      return;
    }

    backgroundAudioContextRef.current = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
    backgroundMusicGainRef.current = backgroundAudioContextRef.current.createGain();
    backgroundMusicGainRef.current.gain.value = 0;
    backgroundMusicGainRef.current.connect(backgroundAudioContextRef.current.destination);

    const osc = backgroundAudioContextRef.current.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 196;
    osc.connect(backgroundMusicGainRef.current);
    osc.start();
  }

  function scheduleTannPulse(startTime) {
    const gain = backgroundMusicGainRef.current;
    if (!gain) {
      return;
    }
    const envelope = gain.gain;
    const peak = 2.6 + Math.random() * 0.8;
    const decay = 1 + Math.random() * 0.5;
    envelope.cancelScheduledValues(startTime);
    envelope.setValueAtTime(0, startTime);
    envelope.linearRampToValueAtTime(peak, startTime + 0.01);
    envelope.exponentialRampToValueAtTime(0.02, startTime + 0.12);
    envelope.setTargetAtTime(0, startTime + 0.18, decay);
  }

  function playTannSequence() {
    if (!backgroundAudioContextRef.current || !backgroundMusicGainRef.current) {
      return;
    }
    const now = backgroundAudioContextRef.current.currentTime;
    scheduleTannPulse(now + 0.1);
    scheduleTannPulse(now + 0.35);
    scheduleTannPulse(now + 0.5);
    scheduleTannPulse(now + 0.65);
    scheduleTannPulse(now + 0.9);
  }

  function startBackgroundMusic() {
    ensureBackgroundMusic();
    if (!backgroundAudioContextRef.current || !backgroundMusicGainRef.current) {
      return;
    }

    if (backgroundAudioContextRef.current.state === 'suspended') {
      backgroundAudioContextRef.current.resume();
    }

    playTannSequence();
    if (backgroundMusicPulseIntervalRef.current) {
      clearInterval(backgroundMusicPulseIntervalRef.current);
    }
    const intervalId = setInterval(playTannSequence, 1800);
    backgroundMusicPulseIntervalRef.current = intervalId;
    
  }

  function stopBackgroundMusic() {
    if (backgroundMusicPulseIntervalRef.current) {
      clearInterval(backgroundMusicPulseIntervalRef.current);
      backgroundMusicPulseIntervalRef.current = null;
      
    }
    if (!backgroundAudioContextRef.current || !backgroundMusicGainRef.current) {
      return;
    }
    backgroundMusicGainRef.current.gain.cancelScheduledValues(backgroundAudioContextRef.current.currentTime);
    backgroundMusicGainRef.current.gain.setTargetAtTime(0, backgroundAudioContextRef.current.currentTime, 0.2);
  }

  const utteranceOnEnd = function() {
    if (!speechLoopActiveRef.current) {
      return;
    }

    setTotalCount(prevTotalCount => Math.max(0, prevTotalCount + 1));
    speechTimeoutRef.current = setTimeout(speakNaam, 250);
  }

  const utteranceOnError = function() {
    if (speechLoopActiveRef.current) {
      speechTimeoutRef.current = setTimeout(speakNaam, 500);
    }
  }

  function speakNaam() {
    if (!speechLoopActiveRef.current) {
      return;
    }

    const naamInput = document.getElementById('naamInput');
    const naam = (naamInput?.value.trim()) || 'Radha';
    if (!naam) {
      stopSpeechLoop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(naam);
    if (hindiVoiceRef.current) {
      utterance.voice = hindiVoiceRef.current;
    } else {
      utterance.lang = 'hi-IN';
    }
    utterance.rate = 0.8;
    utterance.pitch = 0.6;
    utterance.volume = 0.8;
    utterance.onend = utteranceOnEnd;
    utterance.onerror = utteranceOnError;
    speechSynthesisRef?.cancel?.();
    speechSynthesisRef?.speak?.(utterance);
  }

  function updateDisplay() {
    const tmpCompletedMaala = Math.floor(totalCount / MAALA_SIZE);
    const tmpCurrentCycle = totalCount % MAALA_SIZE
    const tmpRemaining = tmpCurrentCycle === 0 && totalCount > 0 ? MAALA_SIZE : MAALA_SIZE - tmpCurrentCycle;

    setCompletedMaala(tmpCompletedMaala);
    setRemaining(tmpRemaining);
    setCurrentCycle(tmpCurrentCycle)
  }

  useEffect(() => {
    speechLoopActiveRef.current = speechLoopActive;
    if (speechLoopActive) {
      startSpeechLoop();
    } else {
      stopSpeechLoop();
    }
  }, [speechLoopActive]);

  useEffect(() => {
    doPageLoadTasks();
    const speechSynthesisApi = speechSynthesisRef;
    if (!speechSynthesisApi) {
      updateSpeechVoiceStatus('Speech synthesis not supported', 'text-danger');
      return undefined;
    }

    startHindiVoiceLoad();
    loadHindiVoice();

    const handleVoicesChanged = () => loadHindiVoice();
    speechSynthesisApi.addEventListener?.('voiceschanged', handleVoicesChanged);
    speechSynthesisApi.onvoiceschanged = handleVoicesChanged;

    return () => {
      speechSynthesisApi.removeEventListener?.('voiceschanged', handleVoicesChanged);
      if (speechSynthesisApi.onvoiceschanged === handleVoicesChanged) {
        speechSynthesisApi.onvoiceschanged = null;
      }
      if (voiceStatusHideTimeoutRef.current) {
        clearTimeout(voiceStatusHideTimeoutRef.current);
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (backgroundMusicPulseIntervalRef.current) {
        clearInterval(backgroundMusicPulseIntervalRef.current);
      }
      speechSynthesisApi.cancel?.();
    };
  }, []);

  useEffect(() => {
    updateDisplay();
  }, [totalCount]);

  // Playlist configuration
  const PLAYLIST_ID = 'PLwopdMcwj9YjoaI8RNBx-PIboQyXbxusQ';
  const [playlistItems, setPlaylistItems] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState('');

  async function fetchPlaylist() {
    const apiKey = "AIzaSyDgWr0IPTIVFj1O3r0oIhKQMyafVgIwMt4";
    if (!apiKey) {
      setPlaylistError('No YouTube API key found. Set `window.YOUTUBE_API_KEY` to load video list.');
      return;
    }
    setPlaylistLoading(true);
    try {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${PLAYLIST_ID}&key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      const items = (data.items || []).map(i => ({
        id: i.snippet.resourceId?.videoId,
        title: i.snippet.title,
        thumbnail: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url || '',
      }));
      setPlaylistItems(items);
    } catch (err) {
      setPlaylistError(String(err));
    } finally {
      setPlaylistLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container text-left" id={"counterBody"} style={{ minWidth: '100%', minHeight: '90vh' }}>
      <div className="row p-2 justify-content-center">
        <div id="counter" className="col-12 col-md-6 p-4 bg-opacity-90 rounded-4 border border-secondary">
          <div className="mb-3">
            <label htmlFor="naamInput" className="form-label">Naam being recited</label>
            <input
              type="text"
              defaultValue="Radha"
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
          </div>
          <fieldset className="mb-3">
            <legend className="form-label mb-2">Theme</legend>
            <div id="themeButtons" className="btn-group d-flex flex-nowrap gap-1">
              <button type="button" className="btn btn-outline-light btn-sm flex-fill active" data-theme="default" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Night</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="day" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Day</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="yellowish" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Yellow</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="bluish" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Blue</button>
              <button type="button" className="btn btn-outline-light btn-sm flex-fill" data-theme="greenish" style={{ minWidth: 0, padding: '.35rem .55rem' }}>Green</button>
            </div>
          </fieldset>
          <p className="mb-4">Track your recitation. 1 maala = {MAALA_SIZE} repetitions.</p>

          <div className="mb-3">
            <label htmlFor="increment" className="form-label">Current Count</label>
            <div className="input-group input-group-lg">
              <input
                type="number" disabled={true}
                className="form-control bg-black text-light border-secondary"
                id="increment"
                value={currentCycle}
                onChange={(ele) => console.log(ele.val)}
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
              <div id="speechVoiceStatus" className={`form-text mt-2 ${hindiVoiceStatusClass}`}>{hindiVoiceStatus}</div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between small">
            <div>Completed maala: <span id="completedMaala">{completedMaala}</span></div>
            <div>Remaining: <span id="remainingCount">{remaining}</span></div>
          </div>

          {/* Playlist sidebar: shows on md+ to the right, stacked under counter on small screens */}
          <div id="playlistCol">
            <div className="p-3">
              {playlistLoading && <div className="text-muted">Loading videos…</div>}
              {playlistError && (
                <div className="alert alert-warning p-2 small" role="alert">
                  {playlistError}
                  <div className="mt-1"><a href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`} target="_blank" rel="noreferrer">Open playlist on YouTube</a></div>
                </div>
              )}
              {!playlistLoading && playlistItems.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', justifyContent: 'space-evenly' }}>
                  {playlistItems.map(item => (
                    <a key={item.id} href={`https://www.youtube.com/watch?v=${item.id}&list=${PLAYLIST_ID}`} target="_blank" rel="noreferrer" className="d-flex flex-column flex-shrink-0 text-decoration-none" style={{ minWidth: 220 }}>
                      <img src={item.thumbnail} alt="thumb" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }} />
                      <div className="small mt-2" style={{ color: 'inherit' }}>{item.title}</div>
                    </a>
                  ))}
                </div>
              )}

              {/* Fallback iframe visible when playlist items are not available */}
              {!playlistLoading && !playlistItems.length && (
                <div className="mt-3">
                  <iframe width="100%" height="200" src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}`} title="YouTube playlist" frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
