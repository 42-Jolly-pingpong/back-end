import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: +process.env.DB_PORT || 5432,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	synchronize: true,
};
