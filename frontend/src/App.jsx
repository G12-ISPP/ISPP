import {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {TaskPage} from "./pages/TaskPage";
import {TaskFormPage} from "./pages/TaskFormPage";
import {RegisterFormPage} from "./pages/RegisterFormPage.jsx";
import {LoginFormPage} from "./pages/LoginFormPage.jsx";
import ProductDetail from "./components/Product";
import CustomDesign from "./components/CustomDesign.jsx";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import CustomDesignDetails from "./components/CustomDesignDetails.jsx";
import CustomDesignPrinters from "./components/Design/CustomDesignPrinters.jsx";
import SearchResults from "./components/SearchResults.jsx";
import CustonDesignCancelled from "./components/CustomDesignCancelled.jsx";
import UserDetail from "./components/User";
import MainPage from "./pages/MainPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Cart from "./components/Cart/Cart.jsx";
import {ChatPage} from "./pages/ChatPage"
import 'react-chat-elements/dist/main.css';
import BuyPlan from "./components/BuyPlan/BuyPlan.jsx";
import CancelPlan from "./components/BuyPlan/CancelPlan.jsx";
import ConfirmPlan from "./components/BuyPlan/ConfirmPlan.jsx";

import OrderDetails from "./components/OrderDetails.jsx";
import OrderCancelled from "./components/OrderCancelled.jsx";
import { SearchingPrinterDesignsPage } from './pages/PrinterDesigns.jsx';
import {AuthProvider} from "./context/AuthContext.jsx";
import ConvertToSTL from "./components/ConvertToSTL/ConvertToSTL.jsx";
import MyOrders from './components/myOrders/myOrders.jsx';
import ProductsList from "./components/ProductsList.jsx";
import DesignsPage from "./pages/DesignsPage.jsx";
import PiecesPage from "./pages/PiecesPage.jsx";
import PrintersPage from "./pages/PrintersPage.jsx";
import MaterialsPage from "./pages/MaterialsPage.jsx";
import ArtistsPage from "./pages/ArtistsPage.jsx";
import Privacity from "./pages/PrivacityPage.jsx";
import Terms from "./pages/TermsPage.jsx";

function App() {
    const cartLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]")
    const [cart, setCart] = useState(cartLocalStorage)

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])


    return (
        <BrowserRouter>
            <AuthProvider>
                <Header
                    cart={cart}
                    setCart={setCart}
                />
                <Navbar/>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/tasks" element={<TaskPage/>}/>
                    <Route path="/tasks-create" element={<TaskFormPage/>}/>
                    <Route path="/chat/:roomId" element={<ChatPage/>}/>
                    <Route path="/chat/" element={<ChatPage />} />
                    <Route path="/product-details/:id" element={<ProductDetail cart={cart} setCart={setCart}/>}/>
                    <Route path="/products/:id/edit" element={<EditProduct />} />
                    <Route path="/designs" element={<DesignsPage/>}/>
                    <Route path="/designs/my-design" element={<CustomDesign/>}/>
                    <Route path="/designs/details/:id" element={<CustomDesignDetails/>}/>
                    <Route path="/designs/details-to-printer/:id" element={<CustomDesignPrinters />} />
                    <Route path="/designs/cancelled" element={<CustonDesignCancelled/>}/>
                    <Route path="/pieces" element={<PiecesPage/>}/>
                    <Route path="/printers" element={<PrintersPage/>}/>
                    <Route path="/materials" element={<MaterialsPage/>}/>
                    <Route path="/artists" element={<ArtistsPage/>}/>
                    <Route path="/register" element={<RegisterFormPage/>}/>
                    <Route path="/login" element={<LoginFormPage/>}/>
                    <Route path="/user-details/:id" element={<UserDetail/>}/>
                    <Route path="/user-details/:id/products" element={<ProductsList/>}/>
                    <Route path="/products/add-product" element={<AddProduct/>}/>
                    <Route path="/cart" element={<Cart cart={cart} setCart={setCart}/>}/>
                    <Route path="/order/details/:id" element={<OrderDetails/>}/>
                    <Route path="/order/cancelled" element={<OrderCancelled/>}/>
                    <Route path="/designs/searching_printer" element={<SearchingPrinterDesignsPage />} />
                    <Route path="/convert-to-stl" element={<ConvertToSTL/>}/>
                    <Route path="/myOrders" element={<MyOrders/>}/>
                    <Route path="/search-results" element={<SearchResults/>}/>
                    <Route path="/buy-plan" element={<BuyPlan/>} />
                    <Route path="/cancel-plan" element={<CancelPlan/>} />
                    <Route path="/confirm-plan" element={<ConfirmPlan/>} />
                    <Route path="/privacidad" element={<Privacity/>} />
                    <Route path="/terminos" element={<Terms/>} />
                </Routes>
                <Footer/>
            </AuthProvider>
        </BrowserRouter>
    );

}

export default App;

