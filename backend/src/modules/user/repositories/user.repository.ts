import { WhereOptions } from 'sequelize';
import { BaseRepository } from '../../../shared/repositories/BaseRepository';
import User from '../user.model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as WhereOptions);
  }

  async findByPublicId(publicId: string): Promise<User | null> {
    return this.findOne({ publicId } as WhereOptions);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.findOne({ emailVerificationToken: token } as WhereOptions);
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.findOne({ passwordResetToken: token } as WhereOptions);
  }

  async createUser(data: any): Promise<User> {
    return this.create(data);
  }

  async updateByEmail(email: string, data: any): Promise<boolean> {
    const [affectedRows] = await this.model.update(data, {
      where: { email } as WhereOptions,
    });
    return affectedRows > 0;
  }

  async markEmailAsVerified(userId: number): Promise<boolean> {
    const [affectedRows] = await this.model.update(
      {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
      { where: { id: userId } as WhereOptions }
    );
    return affectedRows > 0;
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.model.update(
      { lastLoginAt: new Date() },
      { where: { id: userId } as WhereOptions }
    );
  }
}

export default new UserRepository();