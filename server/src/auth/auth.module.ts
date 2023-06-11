import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStategy } from './jwt-auth.guard';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('SECRET_KEY'),

                signOptions: {

                    expiresIn: '168h',
                },
            }),
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStategy],
    exports: [JwtModule]
})
export class AuthModule { }
