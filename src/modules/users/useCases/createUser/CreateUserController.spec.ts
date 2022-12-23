import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createDbConnection from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createDbConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("deve retornar 201 com resposta vazia", async () => {
    //cenário

    //ação
    const response = await request(app)
      .post("/api/v1/users")
      .send({ name: "teste", email: "email@email.com.br", password: "senha" });

    //validação
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({});
  });

  it("deve retornar 400 quando o usuário já existir", async () => {
    //cenário
    await request(app)
      .post("/api/v1/users")
      .send({ name: "teste", email: "email@email.com.br", password: "senha" });

    //ação
    const response = await request(app)
      .post("/api/v1/users")
      .send({ name: "teste", email: "email@email.com.br", password: "senha" });

    //validação
    expect(response.status).toBe(400);
    expect(response.text).toBe('{"message":"User already exists"}');
  });
});
