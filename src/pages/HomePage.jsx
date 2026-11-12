import { Link } from 'react-router-dom';
import { SEO, FEATURED_PROFILES, withUtm } from '../assets/js/constants.js';

export default function HomePage() {
  document.title = SEO.default.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', SEO.default.description);
  }
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', SEO.default.keywords);
  }
  return (
    <div className="container text-left">
      <div className="row m-2 py-2">
        <div className="col mb-0 alert alert-info">
          <img src="/logo.PNG" alt="The Good Human" className="d-inline-block" style={{ height: 32 }} />
          {' '}
          What is this about?
        </div>
      </div>
      <div className="row m-2 p-2 bg-body-tertiary rounded">
        <div className="mb-2 col">
          An upcoming platform to shout-out good human beings around us where friends and family can also add their views about the person in form of either testimonials or endorsements.
          <br />
          If you land on a good human being's profile page, most probably someone shared the link with you to spread the goodness. We do not display any picture of the person, but instead we redirect you to their social media profiles and the respective privacy policies take over.
          <br />
          If you wish to terminate your profile listing with us, write us at <a href="mailto:thegoodhuman.in@gmail.com">thegoodhuman.in@gmail.com</a>
          <br />
          <br />
          <br />
          <b>Testimonial v/s Endorsement:</b><br />
          A testimonial as coming from a client and an endorsement as coming from someone promoting your services
        </div>
      </div>

      <div className="row m-2 p-2 bg-body-tertiary rounded">
        <div className="col">
          <h5 className="mt-1">Why appreciate the people around us?</h5>
          <p className="mb-2">
            Most of us carry quiet struggles: pressure at work, worries at home, the feeling of not being enough.
            A few honest words, like <i>"you made a difference"</i>, can lift someone more than we realise.
            Feeling seen and valued is good for mental health, and so is taking the time to say thank you.
            That is why The Good Human exists.
          </p>
          <p className="mb-2">
            Sometimes kindness from friends and family is not enough, and that is okay.
            Talking to a trained professional is a sign of strength, not weakness. If you or someone you care about
            is struggling, reach out.
          </p>
          <p className="small text-secondary mb-1">
            In crisis? Call <a href="tel:14416">Tele-MANAS 14416</a>, India's free, 24&times;7 mental health helpline.
          </p>
        </div>
      </div>

      {FEATURED_PROFILES.length > 0 && (
        <div className="row m-2">
          <div className="col p-0">
            <h5 className="px-2 mt-2">Featured</h5>
            {FEATURED_PROFILES.map((p) => (
              <div key={p.slug} className="card mb-2">
                <div className="card-body">
                  <h6 className="card-title mb-1">{p.name}</h6>
                  <p className="card-text mb-2">{p.blurb}</p>
                  <Link to={`/${p.slug}`} className="btn btn-sm btn-outline-primary me-2">View profile</Link>
                  {p.website && (
                    <a href={withUtm(p.website, 'home_featured')} target="_blank" rel="noopener" className="btn btn-sm btn-success">
                      Visit website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
