import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import authConfig from '../config/auth.config';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      clientID: authConfiguration?.googleClientId,
      clientSecret: authConfiguration.googleClientSecret,
      callbackURL: authConfiguration.googleClientUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { emails, displayName, provider } = profile;

      let user = await this.userRepository.findOne({
        where: { email: emails[0].value },
      });

      if (!user) {
        user = this.userRepository.create({
          name: displayName,
          email: emails[0].value,
          provider: provider,
          password: '',
        });

        user = await this.userRepository.save(user);
      }
      done(null, user);
    } catch (error) {
      console.log('google strategy error', error);
      done(error || new Error('Internal server error'), false);
    }
  }
}
