import { Commit } from "./Commit";
import { DestinationRepository } from "./DestinationRepository";
import { Branch } from "./Branch";

export class Destination {
  commit: Commit;
  repository: DestinationRepository;
  branch: Branch;
}
