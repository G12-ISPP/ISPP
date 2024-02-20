import { useEffect } from "react";
import { getAllTasks } from "../api/tasks.api";

export default function TasksList() {
  useEffect(() => {
    function loadTest() {
      console.log("loadTest", getAllTasks()); // getAllTasks();
    }
    loadTest();
  }, []);

  return <div>TasksList</div>;
}
