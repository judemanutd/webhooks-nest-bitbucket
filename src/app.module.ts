import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "./config/config.module";
import { SlackService } from "./slack.service";

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [SlackService],
})
export class AppModule {}
