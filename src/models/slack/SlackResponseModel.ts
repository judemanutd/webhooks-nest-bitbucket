import { Blocks } from "./Blocks";

export class SlackResponseModel {
  blocks: Blocks[];

  constructor() {
    this.blocks = [];
  }
}
