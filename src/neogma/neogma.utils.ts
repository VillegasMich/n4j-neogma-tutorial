import { ConfigService } from '@nestjs/config';
import { NeogmaModuleOptions } from './neogma-config.interface';
import { Neogma } from 'neogma';
import { UserModel, UserModelType } from '../user/user.model';

/**
 * Creates the database connection configuration.
 * @param configService - NestJS ConfigService for environment variables.
 * @param customConfig - Optional custom database configuration.
 * @returns NeogmaModuleOptions with database credentials.
 */
export const createDatabaseConnection = (
  configService: ConfigService,
  customConfig?: NeogmaModuleOptions,
) =>
  customConfig || {
    uri: configService.get<string>('DATABASE_URI'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
  };

/**
 * Seeds the database with initial user data.
 * @param neogma - Neogma instance for database interaction.
 */
export const seedData = async (neogma: Neogma) => {
  await neogma.queryRunner.run('MATCH (n) DETACH DELETE n'); // Clear the database

  const userModel: UserModelType = UserModel(neogma);

  const users = Array.from({ length: 10 }, (_, i) => ({
    name: `John Doe ${i}`,
    email: `john.doe${i}@example.com`,
  }));

  const createdUsers = await userModel.createMany(users);

  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i];
    if (i + 1 < createdUsers.length) {
      await user.relateTo({
        alias: 'LikesUser',
        where: { name: createdUsers[i + 1].name },
      });
    } else {
      await user.relateTo({
        alias: 'LikesUser',
        where: { name: createdUsers[0].name },
      });
    }
  }
};

/**
 * Custom error class for handling database connection errors.
 */
export class ConnectionError extends Error {
  public details: string;
  constructor(oldError: Error) {
    super();
    this.message = `Error connecting to the database`;
    this.name = 'ConnectionError';
    this.stack = oldError.stack;
    this.details = oldError.message;
  }
}
