import { User } from '@skyrise-eng/types';
import { getSkipLimit, Core } from '@utils';
import { UserCoreWrapper } from '@src/data/interfaces/wrappers';
import { UserListPagination } from '@domains/interfaces/models';
import { UserModel } from './User';

export class UserCore extends Core<User> implements UserCoreWrapper {
  protected Model = UserModel;

  protected ModelName = 'User';

  findByEmail(email: string) {
    return this.Model.findOne({ email });
  }

  async findAll(pagination: UserListPagination) {
    const { skip, limit } = getSkipLimit(pagination);

    const query = this.Model.find();

    const [count, data] = await Promise.all([
      query.clone().countDocuments(),
      this.Model.find().sort({ _id: -1 }).skip(skip).limit(limit)
    ]);

    return { count, data };
  }
}
