import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import  ProductDetail  from "./components/Product";
import CustomDesign from "./components/CustomDesign.jsx";
import { Navigation } from "./components/Navigation";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks-create" element={<TaskFormPage />} />
        <Route path="/product-details/:id" element={<ProductDetail />} />
        <Route path="/designs/my-design" element={<CustomDesign />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
