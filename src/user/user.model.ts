import {
  ModelFactory,
  ModelRelatedNodesI,
  Neogma,
  NeogmaInstance,
} from 'neogma';

export type UserPropertiesI = {
  name: string;
  email: string;
};

export type UserInstance = NeogmaInstance<UserPropertiesI, UserRelatedNodes>;

export interface UserRelatedNodes {
  LikesUser: ModelRelatedNodesI<UserModelType, UserInstance>;
}

export const UserModel = (neogma: Neogma) =>
  ModelFactory<UserPropertiesI, UserRelatedNodes>(
    {
      label: 'User',
      primaryKeyField: 'name',
      schema: {
        name: {
          type: 'string',
          required: true,
        },
        email: {
          type: 'string',
          required: true,
        },
      },
      relationships: {
        LikesUser: {
          model: 'self',
          direction: 'out',
          name: 'LikesUser',
        },
      },
    },
    neogma,
  );

export type UserModelType = ReturnType<typeof UserModel>;
