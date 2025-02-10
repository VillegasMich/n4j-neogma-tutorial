import { Injectable, Inject } from '@nestjs/common';
import { Neogma } from 'neogma';
import { NEOGMA_CONNECTION } from 'src/neogma/neogma-config.interface';
import { UserModel, UserModelType } from './user.model';

@Injectable()
export class UserService {
  private userModel: UserModelType;

  constructor(@Inject(NEOGMA_CONNECTION) private readonly neogma: Neogma) {
    this.userModel = UserModel(this.neogma);
  }
}
