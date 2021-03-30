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
  getUsers() {
    return this.usersService.findAll();
  }

  @Query('user')
  getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') args: CreateUserInput): Promise<User> {
    const createdUser = await this.usersService.createUser(args);

    pubSub.publish('userCreated', { userCreated: createdUser });

    return createdUser;
  }

  @ResolveField()
  address(@Parent() user: User) {
    const { addressId } = user;

    return this.usersService.findAddress(addressId);
  }

  @ResolveField()
  purchases(@Parent() user: User, page = 1) {
    const userId = user.id;

    return this.usersService.findPurchases(userId, page);
  }

  @Subscription('userCreated')
  userCreated() {
    return pubSub.asyncIterator('userCreated');
  }
}
