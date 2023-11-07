import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';

export function setupSwagger(app: INestApplication): void {
	const options = new DocumentBuilder()
		.setTitle('jollypingpong API Docs')
		.setDescription('jollypingpong API')
		.setVersion('1.0.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.enableCors({
		origin: true,
		credentials: true,
	});
	setupSwagger(app);

	await app.listen(3000);
}
bootstrap();
