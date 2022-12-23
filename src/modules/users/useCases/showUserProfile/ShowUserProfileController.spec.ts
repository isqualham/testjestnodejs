import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createDbConnection from "../../../../database";

let connection: Connection;

describe("Show User Controller", () => {
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

  it("Deve retornar as informações do usuário autenticado", async () => {
    //cenário
    const auth = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "email@email.com.br", password: "senha" });

    const { token } = auth.body;

    //ação
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    //validação
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("Não deve retornar as informações do usuário quando o JWT estiver errado", async () => {
    //cenário

    //ação
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer blablabla` });

    //validação
    expect(response.status).toBe(401);
  });
});
