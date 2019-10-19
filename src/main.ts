import { NestFactory } from "@nestjs/core";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({ origin: true }));
  app.use(helmet());
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(3000);
}
// tslint:disable-next-line: no-floating-promises
bootstrap();
