import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3000;
  const options = {
    //ici on pourra passer les en-tête cors
  }
  const app = await NestFactory.create(AppModule, options);

  // Va appliquer la stratégie JWT du guard sur toutes les routes de l'appli
  // const reflector = app.get( Reflector );
  // app.useGlobalGuards(new JwtAuthGuard(reflector))

  // Pas forcément nécessaire de typer
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(port);
}
bootstrap();
