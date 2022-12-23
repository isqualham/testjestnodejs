import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

let statement;
export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;

    const splittedPath = request.originalUrl.split("/");
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    if (type === OperationType.TRANSFER) {
      const transferStatement = container.resolve(TransferStatementUseCase);

      statement = await transferStatement.execute({
        sender_id: user_id,
        receiver_id,
        type,
        amount,
        description,
      });
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
