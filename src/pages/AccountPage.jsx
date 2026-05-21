import { SEO } from '../assets/js/constants.js';

export default function AccountPage() {
  document.title = `${SEO.default.title} | Account`;
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
      <div className="row p-2">
        <div className="col col-md-4 p-2">
          <form id="account-form" className="row g-3">
            <div className="col-md-12">
              <label htmlFor="inputEmail" className="form-label">Email</label>
              <input type="email" disabled readOnly className="form-control" id="inputEmail" />
            </div>
            <div className="col-12">
              <label htmlFor="inputName" className="form-label">Name</label>
              <input type="text" className="form-control" id="inputName" placeholder="John Doe" />
            </div>
            <div className="col-12">
              <button type="button" onClick="putAccount()" id="saveAccountBtn" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
