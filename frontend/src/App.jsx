import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import  ProductDetail  from "./components/Product";
import { Navigation } from "./components/Navigation";


function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks-create" element={<TaskFormPage />} />
        <Route path="/product-details/:id" element={<ProductDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
