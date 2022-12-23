import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from "./GetBalanceError";

let userInMemory: InMemoryUsersRepository;
let statementInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    userInMemory = new InMemoryUsersRepository();
    statementInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementInMemory, userInMemory);
  });
  it("deve retornar o balance", async () => {
    //cenário
    const user = await userInMemory.create({
      name: "name",
      email: "email@email.com",
      password: "password",
    });

    const { id } = user;
    await statementInMemory.create({
      user_id: id as string,
      type: "deposit" as OperationType,
      amount: 10,
      description: "description",
    });
    //ação

    const balance = await getBalanceUseCase.execute({
      user_id: id as string,
    });

    //validação
    expect(balance.balance).toEqual(10);
  });

  it("não deve retornar o balance quando o usuário não existe", async () => {
    //cenário

    //ação

    //validação
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
