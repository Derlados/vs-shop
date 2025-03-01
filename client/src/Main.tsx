import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import ButtonUp from './components/ButtonUp/ButtonUp'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import ScrollToTop from './lib/components/ScrollToTop/ScrollToTop'
import cartStore from './stores/cart/cart.store'
import catalogStore from './stores/catalog/catalog.store'
import { CartProvider } from './providers/cart/cart.provider'
import DobleBounceLoader from './lib/components/DobleBounceLoader/DobleBounceLoader'

const Main = observer(() => {
  useEffect(() => {
    cartStore.init();
    catalogStore.init();
  }, []);


  if (!cartStore.isInit || !catalogStore.isInit) {
    return (
      <div className='app__main ccc'>
        <DobleBounceLoader color='primary' size='huge' />
      </div>
    )
  };

  return (
    <div className='app__main cct'>
      <CartProvider>
        <ScrollToTop />
        <Header />
        <div className='app__content ccc'>
          <div className='app__page cct'>
            <Outlet />
          </div>
        </div>
        <Footer />
        <ButtonUp />
      </CartProvider>
    </div>
  )
})

export default Main
