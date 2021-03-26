import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CreateUserInput } from './graphql.schema';
import { User } from '@prisma/client';
import { AppService } from './app.service';

// const pubSub = new PubSub();

@Resolver('User')
export class UsersResolver {
  constructor(private readonly appService: AppService) {}

  @Query('users')
  async getUsers() {
    return this.appService.findAll();
  }

  // @Query('user')
  // async findOneById(
  //   @Args('id', ParseIntPipe)
  //   id: number,
  // ): Promise<User> {
  //   return this.appService.findOneById(id);
  // }

  @Mutation('createUser')
  async create(@Args('createUserInput') args: CreateUserInput): Promise<User> {
    const createdUser = await this.appService.createUser(args);
    // pubSub.publish('catCreated', { catCreated: createdCat });
    return createdUser;
  }

  // @Subscription('catCreated')
  // catCreated() {
  //   return pubSub.asyncIterator('catCreated');
  // }
}
