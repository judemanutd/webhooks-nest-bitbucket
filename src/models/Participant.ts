import { Actor } from "./Actor";

export class Participant {
  role: string;
  participated_on: Date;
  type: string;
  user: Actor;
  approved: boolean;
}
