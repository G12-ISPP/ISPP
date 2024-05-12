import {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RegisterFormPage} from "./pages/RegisterFormPage.jsx";
import {LoginFormPage} from "./pages/LoginFormPage.jsx";
import ProductDetail from "./components/Product";
import CustomDesign from "./components/CustomDesign.jsx";
import AddProduct from "./components/AddProduct.jsx";
import EditProduct from "./components/EditProduct";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import CustomModelDetails from "./components/CustomDesignDetails.jsx";
import CustomDesignPrinters from "./components/Design/CustomDesignPrinters.jsx";
import SearchResults from "./components/SearchResults.jsx";
import CustonDesignCancelled from "./components/CustomDesignCancelled.jsx";
import UserDetail from "./components/User";
import MainPage from "./pages/MainPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Cart from "./components/Cart/Cart.jsx";
import {ChatPage} from "./pages/ChatPage"
import 'react-chat-elements/dist/main.css';
import './App.css'
import BuyPlan from "./components/BuyPlan/BuyPlan.jsx";
import CancelPlan from "./components/BuyPlan/CancelPlan.jsx";
import ConfirmPlan from "./components/BuyPlan/ConfirmPlan.jsx";
import PersonalComunityPage from "./pages/PersonalComunityPage.jsx";
import OrderDetails from "./components/OrderDetails.jsx";
import OrderCancelled from "./components/OrderCancelled.jsx";
import { SearchingPrinterDesignsPage } from './pages/PrinterDesigns.jsx';
import {EditProfilePage} from "./pages/EditProfilePage";
import {AuthProvider} from "./context/AuthContext.jsx";
import ConvertToSTL from "./components/ConvertToSTL/ConvertToSTL.jsx";
import MyOrders from './components/myOrders/myOrders.jsx';
import ProductsList from "./components/ProductsList.jsx";
import DesignsPage from "./pages/DesignsPage.jsx";
import PiecesPage from "./pages/PiecesPage.jsx";
import PrintersPage from "./pages/PrintersPage.jsx";
import MaterialsPage from "./pages/MaterialsPage.jsx";
import ToPrintPage from "./pages/ToPrintPage.jsx";
import ArtistsPage from "./pages/ArtistsPage.jsx";
import RequestsPage from "./pages/RequestsPage.jsx";
import ComunityPage from "./pages/ComunityPage.jsx";
import AddPost from "./components/Post/AddPost.jsx";
import Terms from "./pages/TermsPage.jsx";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail.jsx";
import Admin from "./components/Admin/Admin.jsx";
import UsersList from "./components/UsersList/UsersList.jsx";
import ReportsList from "./components/ReportsList/ReportsList.jsx";
import FollowingList from "./components/FollowingList.jsx";
import FollowersList from "./components/FollowersList.jsx";
import PostDetail from './components/Post/PostDetail.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';


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
                    <Route path="/" element={<MainPage cart={cart} setCart={setCart}/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/admin/users" element={<UsersList/>}/>
                    <Route path="/admin/reports" element={<ReportsList/>}/>
                    <Route path="/chat/:roomId" element={<ChatPage/>}/>
                    <Route path="/chat/" element={<ChatPage />} />
                    <Route path="/product-details/:id" element={<ProductDetail cart={cart} setCart={setCart}/>}/>
                    <Route path="/products/:id/edit" element={<EditProduct />} />
                    <Route path="/designs" element={<DesignsPage cart={cart} setCart={setCart}/>}/>
                    <Route path="/designs/my-design" element={<CustomDesign/>}/>
                    <Route path="/designs/details/:id" element={<CustomModelDetails/>}/>
                    <Route path="/designs/details-to-printer/:id" element={<CustomDesignPrinters />} />
                    <Route path="/designs/cancelled" element={<CustonDesignCancelled/>}/>
                    <Route path="/pieces" element={<PiecesPage cart={cart} setCart={setCart}/>}/>
                    <Route path="/to-print/:id" element={<ToPrintPage/>}/>
                    <Route path="/printers" element={<PrintersPage cart={cart} setCart={setCart}/>}/>
                    <Route path="/materials" element={<MaterialsPage cart={cart} setCart={setCart}/>}/>
                    <Route path="/artists" element={<ArtistsPage/>}/>
                    <Route path="/register" element={<RegisterFormPage/>}/>
                    <Route path="/login" element={<LoginFormPage/>}/>
                    <Route path="/user-details/:id" element={<UserDetail/>}/>
                    <Route path="/update-profile/:id" element={<EditProfilePage/>}/>
                    <Route path="/user-details/:id/products" element={<ProductsList/>}/>
                    <Route path="/user-details/:id/following" element={<FollowingList/>}/>
                    <Route path="/user-details/:id/followers" element={<FollowersList/>}/>
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
                    <Route path="/community" element={<ComunityPage />} />
                    <Route path="/community/:id" element={<PersonalComunityPage />} />
                    <Route path="/community/post/:id" element={<PostDetail />} />
                    <Route path="/posts/add-post" element={<AddPost/>}/>
                    <Route path="/privacy" element={<PrivacyPolicyPage/>} />
                    <Route path="/terminos" element={<Terms/>} />
                    <Route path="/verify-email/:uuid/:token" element={<VerifyEmail />} />
                    <Route path="/requests/:id" element={<RequestsPage/>} />
                </Routes>
                <Footer/>
            </AuthProvider>
        </BrowserRouter>
    );

}

export default App;

