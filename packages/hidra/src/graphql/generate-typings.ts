import { join } from 'path';

import { GraphQLDefinitionsFactory } from '@nestjs/graphql';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/modules/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql/graphql.schema.ts'),
  outputAs: 'class',
  watch: true,
});
