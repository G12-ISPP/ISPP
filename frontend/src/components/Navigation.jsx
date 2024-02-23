import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div>
      <Link to="/tasks-create">Create task</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/products-details/1">Product Detail 1</Link>
    </div>
  );
}


