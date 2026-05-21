import { SEO } from '../assets/js/constants.js';

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
    </div>
  );
}
