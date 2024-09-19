import { Link } from "react-router-dom";

import { User } from "../lib/types";

export function Header({ user }: { user: User | null }) {
  return (
    <header className="z-1">
      <nav className="navbar bg-white shadow-sm">
        <div className="container">
          <Link to="/">
            <h1 className="navbar-brand">Task Manager</h1>
          </Link>
          {user && (
            <Link to={"/"} className="text-reset">
              <div className="d-flex gap-2 align-items-center">
                <span className="bg-light p-2 rounded-pill fs-3">
                  <i className="bi-person-fill"></i>
                </span>
                <div className="d-flex flex-column">
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-secondary small">{user.email}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
