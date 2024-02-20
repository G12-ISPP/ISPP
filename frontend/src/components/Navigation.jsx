import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div>
      <Link to="/tasks-create">Create task</Link>
      <Link to="/tasks">Tasks</Link>
    </div>
  );
}
