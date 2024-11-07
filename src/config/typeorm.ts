import { registerAs } from '@nestjs/config';
import { config as configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

configDotenv({ path: '.development.env'});
console.log(process.env.NODE_ENV)
let config = {}
if(process.env.NODE_ENV === 'production')
  {console.log("produccion")
    config = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist//*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      autoLoadEntities: true,
      logging: false,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
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
  entities: ['dist//*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: false,
  synchronize: true,
  dropSchema: false,
}
}
console.log('Current working directory:', process.cwd());
export default registerAs('typeorm', () => config);
