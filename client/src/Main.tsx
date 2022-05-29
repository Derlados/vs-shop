import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ButtonUp from './components/ButtonUp'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Checkout from './pages/checkout/Checkout'
import Home from './pages/home/Home'
import ProductInfo from './pages/product/ProductInfo'
import Shop from './pages/shop/Shop'

const Main = () => {
    return (
        <div className='app__main cct'>
            <Header />
            <div className='app__content cct'>
                <div className='app__page'>
                    <Routes>
                        <Route path='*' element={<Navigate to='/home' />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/checkout' element={<Checkout />} />
                        <Route path='/:catalog' element={<Shop />} />
                        <Route path='/:catalog/:id' element={<ProductInfo />} />
                    </Routes>
                </div>
            </div>
            <Footer />
            <ButtonUp />
        </div>
    )
}

export default Main