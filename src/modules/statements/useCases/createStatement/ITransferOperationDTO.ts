import { Statement } from "../../entities/Statement";

export type ITransferOperationDTO = Pick<
  Statement,
  | "user_id"
  | "description"
  | "amount"
  | "type"
  | "created_at"
  | "updated_at"
  | "sender_id"
>;
