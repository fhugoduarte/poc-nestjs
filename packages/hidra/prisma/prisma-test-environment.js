/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const util = require('util');
const NodeEnvironment = require('jest-environment-node');
const exec = util.promisify(require('child_process').exec);
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve('.env.testing'),
});

class PrismaTestEnvironment extends NodeEnvironment {
  async setup() {
    await exec(`yarn prisma migrate reset --force`);

    return super.setup();
  }
}

module.exports = PrismaTestEnvironment;
