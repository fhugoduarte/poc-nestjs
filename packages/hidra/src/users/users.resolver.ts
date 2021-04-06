import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../common/auth.guard';
import { UsersService } from './users.service';
import * as graphqlFields from 'graphql-fields';

@Resolver('User')
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  getUsers(
    @Args('page') page: number,
    @Args('perPage') perPage: number,
    @Info() info,
  ) {
    const topLevelFields = Object.keys(graphqlFields(info).data);

    return this.usersService.findAll(page, perPage, topLevelFields);
  }

  @Query('user')
  getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }
}
