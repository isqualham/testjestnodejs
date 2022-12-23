import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("deve criar um novo usuário", async () => {
    const user = await createUserUseCase.execute({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
    expect(user).toHaveProperty("id");
  });

  it("não dever criar um novo usuário quando ele já existe", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "name",
        email: "email@email.com",
        password: "password",
      });
      await createUserUseCase.execute({
        name: "name",
        email: "email@email.com",
        password: "password",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
