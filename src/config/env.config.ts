import { Inject } from '@nestjs/common';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';

class EnvConfigService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {}

  public getOrigins() {
    return (
      this.appConfiguration?.allowOrigin
        ?.split(',')
        .map((origin) => origin.trim()) || []
    );
  }
}

export const envConfigService = new EnvConfigService(appConfig());
