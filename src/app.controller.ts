import { Controller, Post, Body } from "@nestjs/common";
import { PullRequestPayload } from "./models/PullRequestPayload";
import { SlackService } from "./slack.service";

const applicable_branches = ["develop", "release", "master"];

@Controller("/deploy")
export class AppController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  async acceptPullRequestHook(@Body() payload: PullRequestPayload): Promise<object> {
    const branch_name = payload.pullrequest.destination.branch.name.toLowerCase();

    if (applicable_branches.includes(branch_name)) {
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
