import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      "https://shavkatnon.softhome.uz",
      "http://localhost:3001",
      "http://localhost:3031",
    ],
  });
  // console.log('I see')
  await app.listen(3031);
}
bootstrap();

//-----
/// ----