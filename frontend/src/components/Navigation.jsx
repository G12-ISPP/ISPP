import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div>
      <Link to="/tasks-create">Create task</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/designs/my-design">Custom Design</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}
