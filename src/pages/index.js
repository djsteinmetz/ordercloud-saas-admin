import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
/** importing our pages */
import Addresses from './addresses';
import Address from './address';
import Home from './home';


export default function Pages() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/:buyerId/addresses" element={<Addresses />} />
                <Route path="/:buyerId/addresses/:addressId" element={<Address />} />
            </Routes>
        </BrowserRouter>
    );
}
