import Header from './components/header/Header';
import './styles/app.scss';
import './styles/general/position.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import ProductInfo from './pages/product/ProductInfo';
import Shop from './pages/shop/Shop';
import Checkout from './pages/checkout/Checkout';
import ButtonUp from './components/ButtonUp';
import Home from './pages/home/Home';
import Catalog from './pages/catalog/Catalog';
import Footer from './components/footer/Footer';

const App = () => {
  return (
    <div className='app cct'>
      <Header />
      <div className='app__content cct'>
        <div className='app__page'>
          <Routes>
            <Route path='*' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/catalog' element={<Catalog />} />
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
export default App;
