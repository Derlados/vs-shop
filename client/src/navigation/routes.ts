import shop from "../store/shop";

export interface ILink {
    title: string;
    to: string;
    img?: string; // Иконка подготавливается в стиле, потому передается название класса
    isNew?: boolean;
}

//TODO проблема с динамическими роутами которые нужное еще и асинхронно подкачивать
export const routes: ILink[] = [
    {
        title: 'Головна',
        to: '/home'
    },
    {
        title: 'Каталоги',
        to: '',
    },
    {
        title: 'Вишивка',
        to: '/embroidery',
        isNew: true
    }
]

export const adminRoutes: ILink[] = [
    {
        title: "Dashboard",
        to: '/admin/dashboard',
        img: 'admin-nav__icon_dashboard'
    },
    {
        title: "Home page",
        to: '/admin/home',
        img: 'admin-nav__icon_home'
    },
    {
        title: "Categories",
        to: '/admin/categories',
        img: 'admin-nav__icon_categories'
    },
    {
        title: "Products",
        to: '/admin/products',
        img: 'admin-nav__icon_products'
    },
    {
        title: "Orders",
        to: '/admin/orders',
        img: 'admin-nav__icon_orders'
    }
]
