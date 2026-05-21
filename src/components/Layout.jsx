import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const loginUrl = 'https://login.goodhuman.in/oauth2/authorize?client_id=6npcn6fde0tucr6npeq625optk&response_type=code&scope=api%2Fall+aws.cognito.signin.user.admin+email+openid&redirect_uri=https%3A%2F%2Fthe.goodhuman.in%2F';
const logoutUrl = 'https://login.goodhuman.in/logout?client_id=6npcn6fde0tucr6npeq625optk&response_type=code&scope=api%2Fall+aws.cognito.signin.user.admin+email+openid&logout_uri=https%3A%2F%2Fthe.goodhuman.in%2Flogout.html';

export default function Layout() {
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const access_token = $.cookie('access_token');
    setToken(access_token)
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary mb-2">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">The Good Human</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Home</NavLink>
                </li>
              </ul>
              <div className="d-flex" role="search">
                <ul className="navbar-nav">
                  {!token && <li className="nav-item me-2">
                    <a id="login-url" className="nav-link" href={loginUrl}>Login</a>
                  </li>}
                  {token && <li className="nav-item dropdown me-2">
                    <button className="nav-link dropdown-toggle btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      User
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                      <li><Link className="dropdown-item" to="/counter">My Counter</Link></li>
                      <li><a id="logout-url" className="dropdown-item" href={logoutUrl}>Logout</a></li>
                    </ul>
                  </li>}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-shrink-0">
        <Outlet />
      </main>
      <footer className="footer mt-auto py-3 bg-body-tertiary">
        <div className="container text-secondary">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
