import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CreateUserInput } from '../graphql.schema';
import { User } from '@prisma/client';
import { UsersService } from './users.service';

const pubSub = new PubSub();

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  async getUsers() {
    return this.usersService.findAll();
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') args: CreateUserInput): Promise<User> {
    const createdUser = await this.usersService.createUser(args);

    pubSub.publish('userCreated', { userCreated: createdUser });

    return createdUser;
  }

  @ResolveField()
  async address(@Parent() user: User) {
    const { addressId } = user;

    return this.usersService.findAddress(addressId);
  }

  @Subscription('userCreated')
  userCreated() {
    console.log('usuario criado');
    return pubSub.asyncIterator('userCreated');
  }
}
