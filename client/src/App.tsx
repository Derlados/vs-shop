import './styles/app/app.scss'
import './styles/app/position.css'
import Main from './Main'
import Home from './pages/home/Home'
import Checkout from './pages/checkout/Checkout'
import Product from './pages/product/Product'
import Shop from './pages/shop/Shop'
import { useEffect } from 'react'
import AOS from 'aos'
import SwiperCore, { Autoplay } from 'swiper'
import Contacts from './pages/contacts/Contacts'
import Page404 from './pages/Page404/Page404'
import { ROUTES } from './values/routes'
import { Navigate, Route, Routes } from 'react-router-dom'

const App = () => {
  useEffect(() => {
    SwiperCore.use([Autoplay])
    AOS.init({
      once: true,
      duration: 700
    })
  }, [])

  return (
    <div className='app cct'>
      <Routes>
        <Route path='/' element={<Main />} >
          <Route path='/home' element={<Home />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/404_not_found' element={<Page404 />} />
          <Route path='/search' element={<Shop isGlobalSearch={true} />} />
          <Route path='/:productName/:id' element={<Product />} />
          <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog/search`} element={<Shop />} />
          <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog`} element={<Shop />} />
          <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog/:filters`} element={<Shop />} />
          <Route path={`/${ROUTES.CATEGORY_PREFIX}:catalog/:filters/search`} element={<Shop />} />
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path='*' element={<Navigate to='/home' replace />} />
        </Route>
        {/* <Route path='*' element={<Navigate to={'/'} />} /> */}
      </Routes>
    </div>
  )
}
export default App
