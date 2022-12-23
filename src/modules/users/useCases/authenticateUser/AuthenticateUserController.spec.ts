import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createDbConnection from "../../../../database";

let connection: Connection;

describe("Authenticate Controller", () => {
  beforeAll(async () => {
    connection = await createDbConnection();
    await connection.runMigrations();
    await request(app)
      .post("/api/v1/users")
      .send({ name: "teste", email: "email@email.com.br", password: "senha" });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Deve autenticar e retornar os dados do usuário", async () => {
    //cenário

    //ação
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "email@email.com.br", password: "senha" });

    //validação
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Não deve autenticar se o e-mail não for encontrado", async () => {
    //cenário

    //ação
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "email2@email.com.br", password: "senha" });

    //validação
    expect(response.status).toBe(401);
    expect(response.text).toBe('{"message":"Incorrect email or password"}');
  });

  it("Não deve autenticar se a senha estiver errada", async () => {
    //cenário

    //ação
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "email@email.com.br", password: "123" });

    //validação
    expect(response.status).toBe(401);
    expect(response.text).toBe('{"message":"Incorrect email or password"}');
  });
});
