import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../kazuo_back/src/app.module'

async function runMigrations() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();
  await app.close();
}

runMigrations().catch((error) => {
  console.error('Error running migrations', error);
  process.exit(1);
});
