import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  getUsers(@Args('page') page: number, @Args('perPage') perPage: number) {
    return this.usersService.findAll(page, perPage);
  }

  @Query('user')
  getUser(@Args('id') id: string) {
    return this.usersService.findById(id);
  }
}
