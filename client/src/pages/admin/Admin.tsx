import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNav from './components/AdminNav/AdminNav'
import './admin.scss';

//TODO подключить Suspence для загрузки
const Admin = () => {
    return (
        <div className='admin rlt'>
            <div className='admin__nav-bar ctl'>
                <AdminNav />
            </div>
            <div className='admin__content ctl'>
                <Outlet />
            </div>
        </div>
    )
}

export default Admin