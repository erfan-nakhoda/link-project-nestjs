import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { swaggerConfig } from './configs/swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfig(app)
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT ?? 3000
  await app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
