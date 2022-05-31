export interface ILink {
    title: string;
    to: string;
    img?: string; // Иконка подготавливается в стиле, потому передается название класса
}

export const routes: ILink[] = [
    {
        title: 'Home',
        to: '/home'
    },
    {
        title: 'Catalog',
        to: '/category1'
    },
    {
        title: 'Contacts',
        to: '/contacts'
    },
    {
        title: 'About',
        to: '/about'
    },
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
