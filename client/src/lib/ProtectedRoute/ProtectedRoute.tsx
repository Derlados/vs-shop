import React, { FC } from 'react'
import { Navigate } from 'react-router-dom';
import Auth from '../../pages/auth/Auth';
import user from '../../store/user';
import { UserRoles } from '../../types/IUser';

interface ProtectedRouteProps {
    isAuth: boolean;
    roles?: UserRoles[];
    element: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ isAuth, roles, element }) => {
    if (!isAuth) {
        return <Navigate to='/auth' />
    }


    if (roles && !user.userInfo?.roles.some(r => roles.includes(r))) {
        return <Navigate to='/home' />
    }

    return element;
}

export default ProtectedRoute