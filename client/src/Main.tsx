import { Outlet } from 'react-router-dom'
import ButtonUp from './components/ButtonUp/ButtonUp'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'

const Main = () => {
    return (
        <div className='app__main cct'>
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
}

export default Main