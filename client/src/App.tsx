import React from 'react';
import Header from './components/Header';
import logo from './logo.svg';
import './styles/shop.scss';
import './styles/app.scss';
import './styles/position.css'
import { Routes } from 'react-router-dom';
import Shop from './pages/shop/Shop';

const App = () => {
  return (
    <div className='app'>
      <Header />
      <div className='app__content ccc'>
        <div className='app__page'>
          <Shop />
          <Routes>

          </Routes>
        </div>
      </div>
    </div>
  )
}
export default App;
