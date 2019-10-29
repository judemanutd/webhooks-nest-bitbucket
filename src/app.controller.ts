import { Controller, Post, Body, Param } from "@nestjs/common";
import { PullRequestPayload } from "./models/PullRequestPayload";
import { SlackService } from "./slack.service";
import { ConfigService } from "./config/config.service";

@Controller("deploy")
export class AppController {
  constructor(
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
  ) {}

  @Post("/:pass")
  async acceptPullRequestHook(
    @Body() payload: PullRequestPayload,
    @Param("pass") pass: string,
  ): Promise<object> {
    const branch_name = payload.pullrequest.destination.branch.name.toLowerCase();

    const applicable_branch = this.configService.get("BRANCH");
    const password = this.configService.get("PASS");

    if (applicable_branch === branch_name && password === pass) {
      // notify pull request received
      const response = this.slackService.generateNotifyPullRequestReceivedMessage(payload);
      await this.slackService.sendSlackNotification(response);

      await this.execShellCommand("./script.sh");

      // notify pull deployed
      const successDeploy = this.slackService.generatePullRequestDeployedMessage(payload);
      await this.slackService.sendSlackNotification(successDeploy);
    }

    return {
      message: "success",
    };
  }

  /**
   * Executes a shell command and return it as a Promise.
   * @param cmd {string}
   * @return {Promise<string>}
   */
  execShellCommand(cmd: string): Promise<string> {
    const exec = require("child_process").exec;
    return new Promise((resolve, reject) => {
      exec(
        cmd,
        (
          error: any,
          stdout: string | PromiseLike<string>,
          stderr: string | PromiseLike<string>,
        ) => {
          if (error) {
            console.warn(error);
            reject(error);
          }
          resolve(stdout ? stdout : stderr);
        },
      );
    });
  }
}
