import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PG_POOL') private pool: Pool,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const query = `INSERT INTO users (username, password_hash)
                  VALUES($1, $2)
                  RETURNING user_id, username, created_at`;
    try {
      const result = await this.pool.query(query, [
        registerDto.username,
        hashedPassword,
      ]);
      return {
        message: 'Username registered successfully',
        user: result.rows[0],
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Username is already taken');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const query = `SELECT user_id, username, password_hash
                  FROM users
                  WHERE username = $1`;

    const result = await this.pool.query(query, [loginDto.username]);

    const user = result.rows[0];

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.hashed_password))
    )
      throw new UnauthorizedException('Invalid Credentials');

    const payload = { sub: user.user_id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accesstoken: accessToken };
  }
}
