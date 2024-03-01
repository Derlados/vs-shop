import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
import ButtonUp from './components/ButtonUp/ButtonUp'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Loader from './lib/components/Loader/Loader'
import ScrollToTop from './lib/components/ScrollToTop/ScrollToTop'
import cartStore from './stores/cart/cart.store'
import catalogStore from './stores/catalog/catalog.store'

const Main = observer(() => {
  if (cartStore.status !== "success" && catalogStore.status === "success") {
    return (
      <div className='app__main ccc'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='app__main cct'>
      <ScrollToTop />
      <Header />
      <div className='app__content ccc'>
        <div className='app__page cct'>
          <Outlet />
        </div>
      </div>
      <Footer />
      <ButtonUp />
    </div>
  )
})

export default Main
