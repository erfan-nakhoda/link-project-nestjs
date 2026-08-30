import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { swaggerConfig } from './configs/swagger.config';
import { UseInterceptors, ValidationPipe } from '@nestjs/common';
import requestIp from "request-ip"
import { GetRequestInterceptor } from './common/interceptors/request.interceptor';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfig(app)
  app.enableCors({
    origin : "http://localhost:4200",
    credentials : true
  })
  app.use(cookieParser(process.env.COOKIE_SERCRET_KEY))
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new GetRequestInterceptor())
  app.use(requestIp.mw())
  const port = process.env.PORT ?? 3000
  await app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
