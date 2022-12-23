import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let showUserProfileInMemory: InMemoryUsersRepository;
let showUserUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User", () => {
  beforeEach(() => {
    showUserProfileInMemory = new InMemoryUsersRepository();
    showUserUseCase = new ShowUserProfileUseCase(showUserProfileInMemory);
    createUserUseCase = new CreateUserUseCase(showUserProfileInMemory);
  });
  it("deve listar usuário por id", async () => {
    //cenário
    const user = await createUserUseCase.execute({
      name: "name",
      email: "email@email.com",
      password: "password",
    });

    //ação
    const userRecovery = showUserUseCase.execute(user.id!!);
    //validação
    expect(user.id).toEqual((await userRecovery).id);
  });

  it("não deve listar usuário quando o id não existe", async () => {
    //cenário

    //ação

    //validação
    expect(showUserUseCase.execute("id")).rejects.toBeInstanceOf(
      ShowUserProfileError
    );
  });
});
