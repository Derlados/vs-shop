import React from 'react';
import Header from './components/Header';
import './styles/app.scss';
import './styles/general/position.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import ProductInfo from './pages/product/ProductInfo';
import Shop from './pages/shop/Shop';
import Checkout from './pages/checkout/Checkout';

const App = () => {
  return (
    <div className='app'>
      <Header />
      <div className='app__content ccc'>
        <div className='app__page'>
          <Routes>
            <Route path='*' element={<Navigate to='/shop' />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/product/:id' element={<ProductInfo />} />
            <Route path='/checkout' element={<Checkout />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
export default App;
