export const getAllTasks = () => {
  return fetch("http://localhost:8000/tasks/api/v1/tasks/").then((response) =>
    response.json()
  );
};
