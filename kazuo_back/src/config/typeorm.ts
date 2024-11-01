import { registerAs } from '@nestjs/config';
import { config as configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

configDotenv({ path: '.development.env'});
console.log(process.env.NODE_ENV)
let config = {}
if(process.env.NODE_ENV === 'production')
  {
    config = {
      type: 'postgres',
      database:process.env.DB_NAME,
      host: process.env.PROD_DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logging: false,
      synchronize: true,
      dropSchema: false,
    };
  }
  
else{
  console.log('llegó acá')
config = {
  type: 'postgres',
  database: 'kazuo',
  host: 'localhost',
  port: parseInt('5432', 10),
  username: 'postgres',
  password: '1420Lion',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: false,
  synchronize: true,
  dropSchema: false,
}
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
