import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import  ProductDetail  from "./components/Product";
import CustomDesign from "./components/CustomDesign.jsx";
import { Navigation } from "./components/Navigation";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Product from "./components/Product/Product.jsx";

import pathImage from './assets/design_buzz_lightyear.jpg';
import Artist from "./components/Artist/Artist.jsx";
import Button, { BUTTON_TYPES } from "./components/Button/Button.jsx";


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

      <Product name='Nombre del producto a mostrar' price='299,99€' pathImage={pathImage} pathDetails='/' />
      <Artist name='Nombre artista' pathImage={pathImage} pathDetails='/' />

      <Button type={BUTTON_TYPES.MEDIUM} text='Comprar' path='/designs/my-design' />
      <Button type={BUTTON_TYPES.LARGE} text='Ver detalles' path='/designs/my-design' />
      <Button type={BUTTON_TYPES.TRANSPARENT} text='Chat' path='/designs/my-design' />

    </BrowserRouter>
  );
}

export default App;
