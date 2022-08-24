import './styles/app/app.scss';
import './styles/app/position.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import Main from './Main';
import user from './store/user';
import { UserRoles } from './types/IUser';
import Admin from './pages/admin/Admin';
import ProtectedRoute from './lib/components/ProtectedRoute/ProtectedRoute';
import DashBoard from './pages/admin/pages/dashboard/DashBoard';
import CategoryEditor from './pages/admin/pages/category-editor/CategoryEditor';
import ProductEditor from './pages/admin/pages/product-editor/ProductEditor';
import OrderList from './pages/admin/pages/orders/OrderList';
import Home from './pages/home/Home';
import Checkout from './pages/checkout/Checkout';
import Product from './pages/product/Product';
import Shop from './pages/shop/Shop';
import HomeEditor from './pages/admin/pages/home-editor/HomeEditor';
import { useEffect } from 'react';
import AOS from 'aos';
import SwiperCore, { Autoplay } from 'swiper';
import Contacts from './pages/contacts/Contacts';
import Page404 from './pages/Page404/Page404';
import { ROUTES } from './values/routes';

const App = () => {

    useEffect(() => {
        SwiperCore.use([Autoplay])
        AOS.init({
            once: true,
            duration: 700
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
                    <Route path='/contacts' element={<Contacts />} />
                    <Route path='/404_not_found' element={<Page404 />} />
                    <Route path='/search' element={<Shop />} />
                    <Route path='/:productName/:id' element={<Product />} />
                    <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog/search`} element={<Shop />} />
                    <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog`} element={<Shop />} />
                    <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog/:filters`} element={<Shop />} />
                    <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog/:filters/search`} element={<Shop />} />
                    <Route path='/' element={<Navigate to='/home' />} />
                    <Route path='*' element={<Navigate to='/home' />} />
                </Route>
                <Route path='*' element={<Navigate to={'/'} />} />
            </Routes>
        </div>
    )
}
export default App;
