import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { seedUserData } from './user.seed';
import { HashingProvider } from 'src/modules/auth/provider/hashing.provider';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const hashProvider = app.get(HashingProvider);

  await seedUserData(dataSource, hashProvider);
}
void runSeeder();
