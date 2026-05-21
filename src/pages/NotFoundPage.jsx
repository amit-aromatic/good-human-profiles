import { Link } from 'react-router-dom';
import { SEO } from '../assets/js/constants.js';

export default function NotFoundPage() {
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
        <div className="col mb-0 alert alert-warning">Page not found</div>
      </div>
      <div className="row m-2 p-2 bg-body-tertiary rounded">
        <div className="col">
          <p>The requested page does not exist.</p>
          <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
      </div>
    </div>
  );
}
