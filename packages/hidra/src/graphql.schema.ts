
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateUserInput {
    name: string;
    email: string;
    address: CreateAddressInput;
}

export class CreateAddressInput {
    street: string;
    city: string;
    state: string;
}

export abstract class IQuery {
    abstract users(): User[] | Promise<User[]>;

    abstract address(): Address | Promise<Address>;
}

export abstract class IMutation {
    abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;
}

export abstract class ISubscription {
    abstract userCreated(): User | Promise<User>;
}

export class User {
    id: string;
    name: string;
    email: string;
    address: Address;
}

export class Address {
    id: string;
    street: string;
    city: string;
    state: string;
}
