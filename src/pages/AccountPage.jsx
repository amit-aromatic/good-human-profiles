import { useEffect, useState } from 'react';
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

  const secureUrls = new Set(['account']);
  const [token, setToken] = useState(null);

  const getAccount = async (access_token) => {
    const settings = {
      "url": "https://api-v1.goodhuman.in/me",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": `Bearer ${access_token}`,
        // "Access-Control-Allow-Origin": globalThis.location.origin
      },
    };
    
    $.ajax(settings).done(function (response) {
      const username = response.find(v => v.Name==='email').Value;
      const name = response.find(v => v.Name==='name')?.Value;
      $('#inputEmail').val(username);
      $('#inputName').val(name);
      $('#account-form').show();
    });
  };

  const putAccount = async () => {
    $('#saveAccountBtn').prop('disabled', true)
    const settings = {
      "url": "https://api-v1.goodhuman.in/me",
      "method": "PUT",
      "timeout": 0,
      "headers": {
        "Authorization": `Bearer ${token}`,
        // "Access-Control-Allow-Origin": globalThis.location.origin
      },
      "data": JSON.stringify({ name: $('#inputName').val() })
    };
    
    $.ajax(settings).done(function (response) {
      $('#saveAccountBtn').prop('disabled', false);
      getAccount(token);
    });
  };

  useEffect(() => {
    const access_token = $.cookie('access_token');
    setToken(access_token)
    $('#account-form').hide();
    const pathname = globalThis.location.pathname.split('/');
    const path = pathname[1];
    if (!secureUrls.has(path)) return;
    if(access_token) getAccount(access_token);
    else globalThis.location.href = $('#login-url').prop('href');
  }, []);

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
              <button type="button" onClick={putAccount} id="saveAccountBtn" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
