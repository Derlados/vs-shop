import Header from './components/header/Header';
import './styles/app.scss';
import './styles/general/position.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import ProductInfo from './pages/product/ProductInfo';
import Shop from './pages/shop/Shop';
import Checkout from './pages/checkout/Checkout';
import ButtonUp from './components/ButtonUp';
import Home from './pages/home/Home';
import Footer from './components/footer/Footer';
import Auth from './pages/auth/Auth';
import Main from './Main';

const App = () => {
    return (
        <div className='app cct'>
            <Routes>
                <Route path='/auth' element={<Auth />} />
                <Route path='*' element={<Main />} />
            </Routes>
        </div>
    )
}
export default App;
