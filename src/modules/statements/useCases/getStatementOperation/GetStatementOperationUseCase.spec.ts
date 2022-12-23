import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

let userInMemory: InMemoryUsersRepository;
let statementInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
describe("Get Statement Operation", () => {
  beforeEach(() => {
    userInMemory = new InMemoryUsersRepository();
    statementInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userInMemory,
      statementInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userInMemory,
      statementInMemory
    );
  });
  it("deve retornar uma operação do statement", async () => {
    //cenário
    const user = await userInMemory.create({
      name: "name",
      email: "email@email.com",
      password: "password",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 10,
      description: "description",
    });

    //ação
    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });
    //validação
    expect(operation).toHaveProperty("id");
  });

  it("não deve retornar uma operação do statement quando o usuário não existe", async () => {
    //cenário

    //ação

    //validação
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "id",
        statement_id: "id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });

  it("não deve retornar uma operação do statement quando o statement não existe", async () => {
    //cenário
    const user = await userInMemory.create({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    //ação

    //validação
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError);
  });
});
