export interface ILink {
    title: string;
    to: string;
}

export const routes: ILink[] = [
    {
        title: 'Home',
        to: '/home'
    },
    {
        title: 'Shop 1',
        to: '/shop-1'
    },
    {
        title: 'Shop 2',
        to: '/shop-2'
    },
    {
        title: 'Contacts',
        to: '/contacts'
    },
    {
        title: 'About',
        to: '/about'
    }
]