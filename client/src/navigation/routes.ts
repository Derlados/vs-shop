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
        title: 'Catalog',
        to: '/catalog'
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

