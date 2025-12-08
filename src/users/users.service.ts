import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { ResponseMessage, ErrorMessage } from '../shared/enums';
import {
  buildOrderClause,
  buildSearchClause,
} from '../shared/utils/filter.util';
import {
  calculateOffset,
  getPaginationParams,
  getPaginationMetadata,
} from '../shared/utils/pagination.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException(ErrorMessage.EMAIL_EXISTS);
      }
      throw new ConflictException(ErrorMessage.USERNAME_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      username,
      email,
      password_hash: hashedPassword,
    } as any);

    const { password_hash: _, ...userData } = user.toJSON();

    return {
      message: ResponseMessage.USER_CREATED,
      user: userData,
    };
  }

  async findAll(filterDto: UserFilterDto) {
    const { page, limit } = getPaginationParams(filterDto.page, filterDto.limit);
    const offset = calculateOffset(page, limit);

    const where: any = {};

    if (filterDto.username) {
      where.username = { [Op.iLike]: `%${filterDto.username}%` };
    }

    if (filterDto.email) {
      where.email = { [Op.iLike]: `%${filterDto.email}%` };
    }

    const searchClause = buildSearchClause(filterDto.search, ['username', 'email']);
    if (searchClause) {
      where[Op.and] = [searchClause];
    }

    const order = buildOrderClause(filterDto.sortBy || 'created_at', filterDto.sortOrder || 'DESC');

    const { rows, count } = await this.userRepository.findAndCountAll({
      where,
      order,
      limit,
      offset,
      attributes: { exclude: ['password_hash'] },
    });

    return {
      message: ResponseMessage.USERS_RETRIEVED,
      data: rows,
      pagination: getPaginationMetadata(count, page, limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    return {
      message: ResponseMessage.USER_RETRIEVED,
      user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: {
          [Op.and]: [
            { user_id: { [Op.ne]: id } },
            {
              [Op.or]: [
                updateUserDto.email ? { email: updateUserDto.email } : {},
                updateUserDto.username ? { username: updateUserDto.username } : {},
              ],
            },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === updateUserDto.email) {
          throw new ConflictException(ErrorMessage.EMAIL_EXISTS);
        }
        throw new ConflictException(ErrorMessage.USERNAME_EXISTS);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await user.update({
      ...updateUserDto,
      password_hash: updateUserDto.password,
    } as any);

    const { password_hash: _, ...userData } = user.toJSON();

    return {
      message: ResponseMessage.USER_UPDATED,
      user: userData,
    };
  }

  async remove(id: number) {
    const user = await this.userRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    await user.destroy();

    return {
      message: ResponseMessage.USER_DELETED,
    };
  }
}

