import { Approval } from "./Approval";
import { Pullrequest } from "./Pullrequest";
import { Repository } from "./Repository";
import { Actor } from "./Actor";

export class PullRequestPayload {
  approval: Approval;
  pullrequest: Pullrequest;
  repository: Repository;
  actor: Actor;
}
