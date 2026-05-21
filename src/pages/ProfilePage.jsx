import { useParams } from 'react-router-dom';
import { SEO as profiles } from '../assets/js/constants.js';

export default function ProfilePage() {
  const { slug } = useParams();
  const profile = profiles[slug];

  if (profile) {
    document.title = profile.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', profile.description);
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', profile.keywords);
    }
  }

  return (
    <div className="container text-left">
      <div className="row p-2">
        <div className="col mb-0 alert alert-info">
          <img src="/logo.PNG" alt="The Good Human" className="d-inline-block" style={{ height: '32px' }} />
          <span id="data_name"></span>
        </div>
      </div>

      <div className="row p-2">
        <div className="col-sm-4 p-0" id="left-pane">
          <div id="data_picture" className="bg-body-tertiary rounded mb-2 p-2">
            <img src="" alt={slug} style={{ width: '100%' }} />
          </div>
          <div id="data_externalLinks" className="bg-body-tertiary rounded mb-2 p-2"></div>
          <div className="bg-body-tertiary rounded mb-2 p-2" id="skills-wrap" style={{ maxHeight: '20rem', overflow: 'auto' }}>
            <h5>Skills</h5>
            <ul id="data_skills"></ul>
          </div>
          <div className="bg-body-tertiary rounded mb-2 p-2" id="traits-wrap" style={{ maxHeight: '20rem', overflow: 'auto' }}>
            <h5>Traits</h5>
            <ul id="data_traits"></ul>
          </div>
        </div>

        <div className="col-sm-8" id="right-pane">
          {/* tabs */}
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="data_story-tab" data-bs-toggle="pill" data-bs-target="#data_story" type="button" role="tab" aria-controls="data_story" aria-selected="false">Story</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="data_testimonials-tab" data-bs-toggle="pill" data-bs-target="#data_testimonials" type="button" role="tab" aria-controls="data_testimonials" aria-selected="false">Testimonials</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="data_endorsements-tab" data-bs-toggle="pill" data-bs-target="#data_endorsements" type="button" role="tab" aria-controls="data_endorsements" aria-selected="false">Endorsements</button>
            </li>
          </ul>
          {/* content */}
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade" id="data_story" role="tabpanel" aria-labelledby="data_story-tab" tabIndex="0"></div>
            <div className="tab-pane fade" id="data_testimonials" role="tabpanel" aria-labelledby="data_testimonials-tab" tabIndex="0"></div>
            <div className="tab-pane fade" id="data_endorsements" role="tabpanel" aria-labelledby="data_endorsements-tab" tabIndex="0"></div>
          </div>
        </div>
      </div>

      {slug === 'core-mind-wellness' && (
        <>
          <p
            id="vuxocallbutton"
            style={{ position: 'fixed', bottom: '10px', right: '10px', cursor: 'pointer' }}
            onClick={() => {
              const iframe = document.getElementById('vuxoiframe');
              if (iframe) {
                const display = { block: 'none', none: 'block' };
                iframe.style.display = display[iframe.style.display] || 'block';
              }
            }}
          >
            <img src="https://i.imgur.com/U2Dz59P.png" alt="vuxo-ai-chat" style={{ width: '40px' }} />
          </p>
          <iframe
            id="vuxoiframe"
            src="https://vuxo.aiempower.ca/embed/240ba3c2-3de2-47df-81aa-72237f06e1ea?isFullScreen=true"
            width="100%"
            height="600"
            style={{ border: 'none', position: 'fixed', bottom: '10px', right: '50px', width: '200px', height: '80%', display: 'none', borderRadius: '10px', minWidth: '300px' }}
            title="Core mind wellness"
          ></iframe>
        </>
      )}
    </div>
  );
}
