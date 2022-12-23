import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let statementInMemory: InMemoryStatementsRepository;
let userInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    userInMemory = new InMemoryUsersRepository();
    statementInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userInMemory,
      statementInMemory
    );
  });
  it("deve criar uma statement", async () => {
    //cenário
    const user = await userInMemory.create({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    //ação
    const { id } = user;
    const statement = await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as OperationType,
      amount: 10,
      description: "description",
    });

    //validação
    expect(statement).toHaveProperty("id");
  });

  it("não deve criar uma statement quando o usuário não é encontrado", async () => {
    //cenário

    //ação

    //validação
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "id",
        type: "deposit" as OperationType,
        amount: 10,
        description: "description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError);
  });

  it("deve criar uma statement quando balance é positivo", async () => {
    //cenário
    const user = await userInMemory.create({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    //ação
    const { id } = user;
    const statementDeposit = await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as OperationType,
      amount: 10,
      description: "description",
    });

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: id as string,
      type: "withdraw" as OperationType,
      amount: 5,
      description: "description",
    });

    //validação
    expect(statementWithdraw.amount).toEqual(5);
  });

  it("não deve criar uma statement quando balance é negativo", async () => {
    //cenário
    const user = await userInMemory.create({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    //ação
    const { id } = user;
    const statementDeposit = await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as OperationType,
      amount: 10,
      description: "description",
    });

    //validação
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: id as string,
        type: "withdraw" as OperationType,
        amount: 15,
        description: "description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError);
  });
});
