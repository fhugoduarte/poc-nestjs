import { GraphQLResolveInfo } from 'graphql';
import * as graphqlFields from 'graphql-fields';

import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';

import { AuthGuard } from '@guards/auth.guard';

import { UsersService } from './users.service';

@Resolver('User')
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  getUsers(
    @Args('page') page: number,
    @Args('perPage') perPage: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    const topLevelFields = Object.keys(graphqlFields(info).data);

    return this.usersService.findAll(page, perPage, topLevelFields);
  }

  @Query('user')
  getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }
}
