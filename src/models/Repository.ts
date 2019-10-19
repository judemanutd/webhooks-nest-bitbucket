import { ActorLinks } from "./ActorLinks";
import { Actor } from "./Actor";

export class Repository {
  scm: string;
  website: string;
  name: string;
  links: ActorLinks;
  full_name: string;
  owner: Actor;
  type: string;
  is_private: boolean;
  uuid: string;
}
