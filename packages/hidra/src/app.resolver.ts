import { ParseIntPipe, UseGuards } from '@nestjs/common';
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
import { CreateUserInput } from './graphql.schema';
import { User } from '@prisma/client';
import { AppService } from './app.service';

const pubSub = new PubSub();

@Resolver('User')
export class UsersResolver {
  constructor(private readonly appService: AppService) {}

  @Query('users')
  async getUsers() {
    return this.appService.findAll();
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') args: CreateUserInput): Promise<User> {
    const createdUser = await this.appService.createUser(args);

    pubSub.publish('userCreated', { userCreated: createdUser });

    return createdUser;
  }

  @ResolveField()
  async address(@Parent() user: User) {
    const { addressId } = user;

    return this.appService.findAddress(addressId);
  }

  @Subscription('userCreated')
  userCreated() {
    console.log('usuario criado');
    return pubSub.asyncIterator('userCreated');
  }
}
