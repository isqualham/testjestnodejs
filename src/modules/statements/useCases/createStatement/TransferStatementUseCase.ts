import { IUsersRepository } from "./../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";

interface IRequest {
  sender_id: string;
  receiver_id: string;
  type: OperationType;
  amount: number;
  description: string;
}

@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject("UserRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementRepository: IStatementsRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    type,
    amount,
    description,
  }: IRequest): Promise<Statement[]> {
    const sender = this.usersRepository.findById(sender_id);
    const receiver = this.usersRepository.findById(receiver_id);

    if (!sender) {
      throw new CreateStatementError.UserNotFound();
    }

    if (!receiver) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type === "transfer") {
      const { balance } = await this.statementRepository.getUserBalance({
        user_id: sender_id,
      });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }

    const senderStatement = await this.statementRepository.create({
      user_id: sender_id,
      receiver_id: receiver_id,
      description,
      amount,
      type: OperationType.TRANSFER,
    });

    const receiverStatement = await this.statementRepository.create({
      user_id: sender_id,
      sender_id: sender_id,
      description,
      amount,
      type: OperationType.TRANSFER,
    });

    return [senderStatement, receiverStatement];
  }
}
