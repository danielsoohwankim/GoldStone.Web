import { IUser } from './_store';
import { IGetUserResponseContract } from '@/clients/goldStoneClient';

class TenantManager {
  public convertToUser(user: IGetUserResponseContract): IUser {
    return {
      id: user.id,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
    };
  }
}

export default new TenantManager();
