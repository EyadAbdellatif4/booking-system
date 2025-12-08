import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { ResponseMessage, ErrorMessage } from '../shared/enums';

/**
 * AuthService is a service that provides methods to manage authentication
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param RegisterDto - The user data
   * @returns The registered user
   */
  async register(RegisterDto: RegisterDto) {
    const { name, email, password } = RegisterDto;

    const existingUser = await this.userRepository.findOne({
      where: {
        [Op.or]: [{ email }, { username: name }],
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
      username: name,
      email,
      password_hash: hashedPassword,
    } as any);

    const { password_hash: _, ...userData } = user.toJSON();

    return {
      message: ResponseMessage.USER_REGISTERED,
      user: userData,
    };
  }

  /**
   * Login a user
   * @param loginDto - The user data
   * @returns The logged in user
   */
  async login(loginDto: LoginDto) {
    if (!loginDto) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.dataValues.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessage.INVALID_CREDENTIALS);
    }

    const payload = {
      sub: user.dataValues.user_id as number,
      email: user.dataValues.email,
      username: user.dataValues.username,
    };

    const token = this.jwtService.sign(payload);

    const { password_hash: _, ...userData } = user.dataValues;

    return {
      message: ResponseMessage.USER_LOGGED_IN,
      user: userData,
      access_token: token,
    };
  }
}
