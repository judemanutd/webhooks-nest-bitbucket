import { Rendered } from "./Rendered";
import { Avatar } from "./Avatar";
import { Destination } from "./Destination";
import { Participant } from "./Participant";
import { Actor } from "./Actor";
import { Summary } from "./Summary";

export class Pullrequest {
  rendered: Rendered;
  type: string;
  description: string;
  links: { [key: string]: Avatar };
  title: string;
  close_source_branch: boolean;
  reviewers: any[];
  id: number;
  destination: Destination;
  created_on: Date;
  summary: Summary;
  source: Destination;
  comment_count: number;
  state: string;
  task_count: number;
  participants: Participant[];
  reason: string;
  updated_on: Date;
  author: Actor;
  merge_commit: null;
  closed_by: null;
}
