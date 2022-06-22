export interface IUser {
    id: number;
    username: string;
    email: string;
    phone?: string;
    roles: UserRoles[];
}

export enum UserRoles {
    ADMIN = 'admin',
    SELLER = 'seller',
    USER = 'user'
}