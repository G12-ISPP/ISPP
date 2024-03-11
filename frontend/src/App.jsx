import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import { RegisterFormPage } from "./pages/RegisterFormPage.jsx";
import { LoginFormPage } from "./pages/LoginFormPage.jsx";
import ProductDetail from "./components/Product";
import CustomDesign from "./components/CustomDesign.jsx";
import AddProduct from "./components/AddProduct.jsx";
import { Navigation } from "./components/Navigation";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Product from "./components/Product/Product.jsx";
import Artist from "./components/Artist/Artist.jsx";
import Button, { BUTTON_TYPES } from "./components/Button/Button.jsx";
import CustomDesignDetails from "./components/CustomDesignDetails.jsx";
import SearchResults from "./components/SearchResults.jsx";
import CustonDesignCancelled from "./components/CustomDesignCancelled.jsx";
import UserDetail from "./components/User";
import ProductsList from "./components/ProductsList.jsx"
import MainPage from "./pages/MainPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Cart from "./components/Cart/Cart.jsx";
import { ChatPage } from "./pages/ChatPage"
import 'react-chat-elements/dist/main.css';

import OrderDetails from "./components/OrderDetails.jsx";
import OrderCancelled from "./components/OrderCancelled.jsx";
import DesignsPage from './pages/DesignsPage.jsx';
import PiecesPage from './pages/PiecesPage.jsx';
import PrintersPage from './pages/PrintersPage.jsx';
import MaterialsPage from './pages/MaterialsPage.jsx';
import ArtistsPage from './pages/ArtistsPage.jsx';

function App() {
  const cartLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]")
  const [cart, setCart] = useState(cartLocalStorage)

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])



  return (
    <BrowserRouter>

      <Header
        cart={cart}
        setCart={setCart}
      />
      <Navbar />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks-create" element={<TaskFormPage />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
        <Route path="/product-details/:id" element={<ProductDetail
          cart={cart}
          setCart={setCart}
        />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/designs/my-design" element={<CustomDesign />} />
        <Route path="/designs/details/:id" element={<CustomDesignDetails />} />
        <Route path="/designs/cancelled" element={<CustonDesignCancelled />} />
        <Route path="/pieces" element={<PiecesPage />} />
        <Route path="/printers" element={<PrintersPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/register" element={<RegisterFormPage />} />
        <Route path="/login" element={<LoginFormPage />} />
        <Route path="/user-details/:id" element={<UserDetail />} />
        <Route path="/user-details/:id/products" element={<ProductsList />} />
        <Route path="/products/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart
          cart={cart}
          setCart={setCart}
        />} />
        <Route path="/order/details/:id" element={<OrderDetails />} />
        <Route path="/order/cancelled" element={<OrderCancelled />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;

