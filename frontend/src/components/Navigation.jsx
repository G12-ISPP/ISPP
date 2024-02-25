import { Link } from "react-router-dom";

export function Navigation() {
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  return (
    <div>
      <Link to="/tasks-create">Create task</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/designs/my-design">Custom Design</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
}
