import { Outlet } from 'react-router-dom'
import ButtonUp from './components/ButtonUp'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'

const Main = () => {
    return (
        <div className='app__main cct'>
            <Header />
            <div className='app__content ccc'>
                <div className='app__page'>
                    <Outlet />
                </div>
            </div>
            <Footer />
            <ButtonUp />
        </div>
    )
}

export default Main