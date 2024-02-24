import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import CustomDesign from "./components/CustomDesign.jsx";
import { Navigation } from "./components/Navigation";
import CustomDesignDetails from "./components/CustomDesignDetails.jsx";
import CustonDesignCancelled from "./components/CustomDesignCancelled.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks-create" element={<TaskFormPage />} />
        <Route path="/designs/my-design" element={<CustomDesign />} />
        <Route path="/designs/details/:id" element={<CustomDesignDetails />} />
        <Route path="/designs/cancelled" element={<CustonDesignCancelled />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
