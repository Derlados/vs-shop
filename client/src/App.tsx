import Header from './components/header/Header';
import './styles/app.scss';
import './styles/general/position.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import Main from './Main';
import user from './store/user';
import { UserRoles } from './types/IUser';
import Admin from './pages/admin/Admin';
import ProtectedRoute from './lib/ProtectedRoute/ProtectedRoute';
import DashBoard from './pages/admin/pages/dashboard/DashBoard';
import CategoryEditor from './pages/admin/pages/category-editor/CategoryEditor';
import ProductEditor from './pages/admin/pages/product-editor/ProductEditor';
import OrderList from './pages/admin/pages/orders/OrderList';
import Home from './pages/home/Home';
import Checkout from './pages/checkout/Checkout';
import ProductInfo from './pages/product/ProductInfo';
import Shop from './pages/shop/Shop';
import Page404 from './pages/page404/Page404';
import HomeEditor from './pages/admin/pages/home-editor/HomeEditor';
import { useEffect } from 'react';
import AOS from 'aos';

const App = () => {

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 1000
        });
    }, [])

    return (
        <div className='app cct'>
            <Routes>
                <Route path='admin' element={<ProtectedRoute isAuth={user.isAuth} roles={[UserRoles.ADMIN, UserRoles.SELLER]} element={<Admin />} />}>
                    <Route path='dashboard' element={<DashBoard />} />
                    <Route path='home' element={<HomeEditor />} />
                    <Route path='categories' element={<CategoryEditor />} />
                    <Route path='products' element={<ProductEditor />} />
                    <Route path='orders' element={<OrderList />} />
                    <Route path='*' element={<Navigate to={'./dashboard'} />} />
                </Route>
                <Route path='auth' element={<Auth />} />
                <Route path='/' element={<Main />} >
                    <Route path='/home' element={<Home />} />
                    <Route path='/checkout' element={<Checkout />} />
                    <Route path='/404_not_found' element={<Page404 />} />
                    <Route path='/:catalog' element={<Shop />} />
                    <Route path='/:catalog/:id' element={<ProductInfo />} />
                    <Route path='/' element={<Navigate to='/home' />} />
                    <Route path='*' element={<Navigate to='/home' />} />
                </Route>
                <Route path='*' element={<Navigate to={'/'} />} />
            </Routes>
        </div>
    )
}
export default App;
