import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import ChooseProduct from "./pages/choose-product";
import Breads from "./pages/breads";
import Sandwiches from "./pages/sandwiches";
import Register from "./pages/register";
import Cart from "./pages/cart";

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/produtos" element={<ChooseProduct/>}/>
                <Route path="/produtos/paes" element={<Breads/>}/>
                <Route path="/produtos/sanduiches" element={<Sandwiches/>}/>
                <Route path="/cadastro" element={<Register/>}/>
                <Route path="/carrinho" element={<Cart/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;
