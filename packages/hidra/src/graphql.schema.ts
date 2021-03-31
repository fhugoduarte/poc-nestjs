
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum ProductType {
    onetime = "onetime",
    recurring = "recurring"
}

export abstract class IQuery {
    abstract purchases(page?: number, perPage?: number): PurchasePagination | Promise<PurchasePagination>;

    abstract purchase(id: string): Purchase | Promise<Purchase>;

    abstract users(page?: number, perPage?: number): UserPagination | Promise<UserPagination>;

    abstract user(id: string): User | Promise<User>;

    abstract address(): Address | Promise<Address>;
}

export class PurchasePagination {
    data: Purchase[];
    page: number;
    perPage: number;
    total: number;
}

export class Purchase {
    id: string;
    status: string;
    product: Product;
    customer: User;
}

export class Product {
    id: string;
    slug: string;
    amount: number;
    type: ProductType;
}

export class UserPagination {
    data: User[];
    page: number;
    perPage: number;
    total: number;
}

export class User {
    id: string;
    name: string;
    email: string;
    address: Address;
    purchases?: Purchase[];
}

export class Address {
    id: string;
    street: string;
    city: string;
    state: string;
}
