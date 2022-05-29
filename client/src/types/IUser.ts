export interface IUser {
    id: number;
    username: string;
    email: string;
    phone?: string;
    roles: UserRoles[];
}

export enum UserRoles {
    ADMIN = 'Admin',
    SELLER = 'Customer',
    USER = 'User'
}