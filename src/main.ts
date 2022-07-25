import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug']
    //ici on pourra passer les en-tête cors
  });

  const config = new DocumentBuilder()
    .setTitle('Retrobrew API')
    .setDescription("API de l'application Retrobrew")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  /*const customOptions: SwaggerCustomOptions = {
    docExpansion: none
  };*/

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Activation des CORS pour le déploiement sur environnement de dev
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  await app.listen(process.env.PORT || port);
}
bootstrap();
