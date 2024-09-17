import { Link } from "react-router-dom";

export function Welcome() {
  return (
    <div className="pt-3 d-flex flex-column align-items-center">
      <h1>Welcome to Task Manager</h1>
      <p>An app for managing tasks</p>
      <div className="d-flex">
        <Link to="/auth/sign-in">Sign in</Link>
        <span className="mx-2">/</span>
        <Link to="/auth/sign-up">Sign up</Link>
      </div>
    </div>
  );
}
