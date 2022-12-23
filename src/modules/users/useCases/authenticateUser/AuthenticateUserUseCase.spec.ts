import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository;
let userUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
    userUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("deve autenticar o usuário", async () => {
    //cenário
    await userUseCase.execute({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    //ação
    const result = await authenticateUserUseCase.execute({
      email: "email@email.com",
      password: "password",
    });

    //validação
    expect(result).toHaveProperty("token");
  });

  it("não deve autenticar usuário caso a senha esteja errada", async () => {
    //cenário
    const user = await userUseCase.execute({
      name: "name",
      email: "email@email.com",
      password: "123456",
    });

    //ação

    //validação
    expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "password",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("não deve autenticar usuário caso o email não exista", async () => {
    //cenário
    const user = await userUseCase.execute({
      name: "name",
      email: "email@email.com",
      password: "123456",
    });

    //ação

    //validação
    expect(
      authenticateUserUseCase.execute({
        email: "email2@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
