import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: dto.role ?? UserRole.MEMBER,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(
      user.id,
      await bcrypt.hash(tokens.refreshToken, 10),
    );

    const { passwordHash, hashedRefreshToken, ...safeUser } = user;

    return { user: safeUser, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findByEmail(payload.email);

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      await this.usersService.updateRefreshToken(
        user.id,
        await bcrypt.hash(tokens.refreshToken, 10),
      );

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
    const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'supersecret',
        expiresIn: accessTokenExpiresIn as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecret',
        expiresIn: refreshTokenExpiresIn as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
