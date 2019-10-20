import { Injectable } from "@nestjs/common";
import request from "request-promise-native";
import momentTimezone from "moment-timezone";
import { PullRequestPayload } from "./models/PullRequestPayload";
import { Blocks } from "./models/slack/Blocks";
import { Text } from "./models/slack/Text";
import { Fields } from "./models/slack/Fields";
import { SlackResponseModel } from "./models/slack/SlackResponseModel";
import { ConfigService } from "./config/config.service";

@Injectable()
export class SlackService {
  private webhook_url: string;

  constructor(config: ConfigService) {
    this.webhook_url = config.get("WEBHOOK_URL");
  }

  generateNotifyPullRequestReceivedMessage(payload: PullRequestPayload): SlackResponseModel {
    try {
      const response: SlackResponseModel = new SlackResponseModel();
      const block: Blocks = new Blocks();
      const blockDivider: Blocks = new Blocks();
      const text: Text = new Text();

      text.text = `Merge Request Received *<${payload.pullrequest.links.html.href}|${payload.pullrequest.title}>* \n\n Fetching and deploying latest code, please wait`;
      text.type = "mrkdwn";
      block.type = "section";
      block.text = text;

      blockDivider.type = "divider";

      response.blocks.push(blockDivider);
      response.blocks.push(block);
      response.blocks.push(blockDivider);

      return response;
    } catch (error) {
      throw error;
    }
  }

  generatePullRequestDeployedMessage(payload: PullRequestPayload): SlackResponseModel {
    try {
      const response: SlackResponseModel = new SlackResponseModel();
      const block: Blocks = new Blocks();
      const text: Text = new Text();

      text.text = `New commit deployed to *<${payload.repository.links.html.href}|${payload.repository.name}>* \n\n *<${payload.pullrequest.links.html.href}|${payload.pullrequest.title}>*`;
      text.type = "mrkdwn";
      block.type = "section";
      block.text = text;
      response.blocks.push(block);

      const messageBody = [
        `*Created:*\n ${momentTimezone(
          payload.pullrequest.created_on,
          momentTimezone.ISO_8601,
          true,
        )
          .tz("Asia/Kolkata")
          .format("Do MMMM YYYY hh:mm:ss A")}`,
        `*Merged:*\n ${momentTimezone(payload.pullrequest.updated_on, momentTimezone.ISO_8601, true)
          .tz("Asia/Kolkata")
          .format("Do MMMM YYYY hh:mm:ss A")}`,
        `*Source Brach:*\n ${payload.pullrequest.source.branch.name}`,
        `*Destination Brach:*\n ${payload.pullrequest.destination.branch.name}`,
      ];
      response.blocks.push(this.generateSlackFieldsBlock(messageBody));

      return response;
    } catch (error) {
      throw error;
    }
  }

  sendSlackNotification(message: SlackResponseModel) {
    try {
      const options = {
        method: "POST",
        uri: this.webhook_url,
        body: message,
        json: true,
      };

      return request(options);
    } catch (error) {
      throw error;
    }
  }

  private generateSlackFieldsBlock(payload: string[]): Blocks {
    try {
      const block: Blocks = new Blocks();
      block.type = "section";

      block.fields = payload.map(value => {
        const field: Fields = new Fields();
        field.type = "mrkdwn";
        field.text = value;

        return field;
      });

      return block;
    } catch (error) {
      throw error;
    }
  }
}
