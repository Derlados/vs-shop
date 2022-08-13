import { FC } from 'react'
import './side-menu.scss';

interface SideMenuProps {
    children: JSX.Element;
    isActive: boolean;
    setActive: (flag: boolean) => void;
}

const SideMenu: FC<SideMenuProps> = ({ children, isActive, setActive }) => {

    return (
        <div className={`side-menu ${isActive ? 'side-menu_open' : ''}`}>
            <div className='side-menu__content'>
                <div className='side-menu__close-btn' onClick={() => setActive(false)}></div>
                {children}
            </div>
        </div>
    )
}

export default SideMenu