import { useParams } from 'react-router-dom';
import { SEO as profiles, PROFILE_EXTRAS, withUtm } from '../assets/js/constants.js';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { slug } = useParams();
  const profile = profiles[slug];
  const extras = PROFILE_EXTRAS[slug] || {};

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
  
  useEffect(() => {
    getData(slug);
  }, [])

  const noDataCard = `
  <div class="card mb-2" style="width: 100%;">
      <div class="card-body">
          <p class="card-text">No data as of now, feature coming soon!</p>
      </div>
  </div>
  `;

  async function getData(slug) {

      const url = `https://the-good-human.s3.ap-south-1.amazonaws.com/profiles/${slug}.json`;
      const res = await fetch(url);
      if (res.status === 403) globalThis.location.href = "/error/not-found";
      const data = await res.json();
      
      // name
      $('#data_name').html(data.name);

      // externalLinks
      const externalLinks = data.externalLinks || [];
      if (!externalLinks.length) $("#data_externalLinks").hide();
      const platformIcons = {
          website: 'bi-globe2',
          whatsapp: 'bi-whatsapp',
          email: 'bi-envelope-fill',
          blog: 'bi-journal-text',
          instagram: 'bi-instagram',
          facebook: 'bi-facebook',
          linkedin: 'bi-linkedin',
          youtube: 'bi-youtube',
      };
      const externalLinksData = externalLinks.filter(item => item.published)
          .map(item => {
              const key = (item.platform || '').toLowerCase();
              const icon = platformIcons[key] || 'bi-link-45deg';
              const href = (extras.utmPlatforms || []).includes(key) ? withUtm(item.url) : item.url;
              return `<a target="_blank" rel="noopener" href="${href}" class="d-inline-flex align-items-center text-decoration-none link-body-emphasis border rounded-pill px-3 py-1 me-1 mb-2" style="font-size: 0.8rem;">
                  <i class="bi ${icon} me-1"></i>
                  <span>${item.platform}</span>
              </a>`;
          });
      $('#data_externalLinks').html(`<div class="d-flex flex-wrap">${externalLinksData.join('')}</div>`);

      // picture
      if (data.picture?.length) {
          $('#data_picture').html(`<img src="${data.picture}" style="width: 100%;">`);
      }
      else {
          $('#data_picture').hide();
      }
      
      // skills
      const skills = data.skills|| [];
      if (!skills.length) $("#skills-wrap").hide();
      const skillsData = skills.map(item => `<span class="badge rounded-pill text-bg-light border fw-normal me-1 mb-1">${item.text}</span>`);
      $('#data_skills').html(skillsData.join(''));

      // traits
      const traits = data.traits|| [];
      if (!traits.length) $("#traits-wrap").hide();
      const traitsData = traits.map(item => `<span class="badge rounded-pill text-bg-success-subtle border border-success-subtle text-success-emphasis fw-normal me-1 mb-1">${item.text}</span>`);
      $('#data_traits').html(traitsData.join(''));

      // left-pane
      if (!skills.length && !traits.length && !externalLinks.length) {
          $('#left-pane').hide();
      }

      // story
      const story = data.story;
      story ? setStoryData(story) : $('#data_story-tab').hide();

      // testimonials
      const testimonials = data.testimonials|| [];
      testimonials.length ? setTestominalsData(testimonials) : $('#data_testimonials-tab').hide();
      
      // endorsements
      const endorsements = data.endorsements|| [];
      endorsements.length ? setEndorsementsData(endorsements) : $('#data_endorsements-tab').hide();
      
      // right-pane
      if ($('#pills-tab .nav-link:visible').length) $('#pills-tab .nav-link:visible')[0].click();
      if (!endorsements.length && !testimonials.length && !story) {
          $('#right-pane').hide();
      }
  }

  function setStoryData(story) {
      const storyData = `<div class="card mb-2" style="width: 100%;">
      <div class="card-body">
          <p class="card-text">${story.text}</p>
          ${extras.mapQuery ? `
            <div class="ratio ratio-16x9 mt-2">
              <iframe src="https://www.google.com/maps?q=${encodeURIComponent(extras.mapQuery)}&amp;output=embed" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${extras.mapQuery} location"></iframe>
            </div>` : ''}
          ${extras.mentalHealthNote ? `
            <p class="small text-secondary mt-3 mb-0">
              <i class="bi bi-heart-pulse me-1"></i>
              In crisis or need someone to talk to right now? Call <a href="tel:14416">Tele-MANAS 14416</a>, India's free, 24&times;7 mental health helpline.
            </p>` : ''}
      </div>
      </div>`;
      $('#data_story').html(storyData || noDataCard);
  }

  function setEndorsementsData(endorsements) {
      const endorsementsData = endorsements.filter(item => item.published).map(item => {
          return `<div class="card mb-2" style="width: 100%;">
              <div class="card-body">
                  <p class="card-text">${item.text}</p>
                  <p class="card-link text-end">
                  ${item.author}
                  <br/>
                  <i style="color: gray;">${item.relation}</i>
                  </p>
              </div>
          </div>`;
      });
      $('#data_endorsements').html(endorsementsData.join('') || noDataCard);
  }

  function setTestominalsData(testimonials) {
      const testimonialsData = testimonials.filter(item => item.published).map(item => {
          return `<div class="card mb-2" style="width: 100%;">
              <div class="card-body">
                  <p class="card-text">${item.text}</p>
                  <p class="card-link text-end">
                  ${item.author}
                  <br/>
                  <i style="color: gray;">${item.relation}</i>
                  </p>
              </div>
          </div>`;
      });
      $('#data_testimonials').html(testimonialsData.join('') || noDataCard);
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
            <div id="data_skills" className="d-flex flex-wrap"></div>
          </div>
          <div className="bg-body-tertiary rounded mb-2 p-2" id="traits-wrap" style={{ maxHeight: '20rem', overflow: 'auto' }}>
            <h5>Traits</h5>
            <div id="data_traits" className="d-flex flex-wrap"></div>
          </div>
        </div>

        <div className="col-sm-8" id="right-pane">
          {extras.cta && (
            <a
              href={withUtm(extras.cta.url, 'cta')}
              target="_blank"
              rel="noopener"
              className="btn btn-success w-100 mb-3"
            >
              <i className="bi bi-calendar-heart me-2"></i>{extras.cta.label}
            </a>
          )}
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

    </div>
  );
}
