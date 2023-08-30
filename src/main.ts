import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
	const options = new DocumentBuilder()
		.setTitle('jollypingpong API Docs')
		.setDescription('jollypingpong API')
		.setVersion('1.0.0')
		.build();

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
  setupSwagger(app);

	await app.listen(3000);
}
bootstrap();
