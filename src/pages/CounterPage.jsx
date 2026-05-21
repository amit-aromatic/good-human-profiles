import { SEO } from '../assets/js/constants.js';

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
  return (
    <div className="container text-left" id={"counterBody"} style={{ minWidth: '100%' }}>
      <div className="row p-2 justify-content-center">
        <div id="counter" className="col-12 col-md-6 p-4 bg-opacity-90 rounded-4 border border-secondary">
          <div className="mb-3">
            <label htmlFor="naamInput" className="form-label">Naam being recited</label>
            <input
              type="text"
              value="Radha"
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
          <p className="mb-4">Track your recitation. 1 maala = 108 repetitions.</p>

          <div className="mb-3">
            <label htmlFor="increment" className="form-label">Current Count</label>
            <div className="input-group input-group-lg">
              <input
                type="number"
                className="form-control bg-black text-light border-secondary"
                id="increment"
                value="0"
                style={{ fontSize: '2rem', textAlign: 'center' }}
              />
              <span className="input-group-text bg-black text-light border-secondary" id="incrementStep">/ 108</span>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <button type="button" className="btn btn-outline-light w-100" id="resetBtn">Reset</button>
            </div>
            <div className="col-6">
              <button type="button" className="btn btn-light border-secondary w-100" id="incrementBtn">+1</button>
            </div>
          </div>
          <div className="row g-2 mb-3">
            <div className="col-12">
              <button type="button" className="btn border-secondary w-100" id="speechBtn">
                <span id="speechBtnIcon" aria-hidden="true">🔊</span>
                <span id="speechBtnLabel">Start Speech</span>
              </button>
              <div id="speechVoiceStatus" className="form-text text-warning mt-2">Loading Hindi voice…</div>
            </div>
          </div>

          <div className="d-flex justify-content-between small">
            <div>Completed maala: <span id="completedMaala">0</span></div>
            <div>Remaining: <span id="remainingCount">108</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
