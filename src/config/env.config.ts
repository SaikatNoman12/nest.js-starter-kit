class EnvConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public getOrigins() {
    return (
      this.getValue('ALLOW_ORIGINS')
        ?.split(',')
        .map((origin) => origin.trim()) || []
    );
  }
}

export const envConfigService = new EnvConfigService(process.env);
