// Unit tests for the Express application.
// Tests the root endpoint without starting a server.
// See https://vitest.dev/ for the test framework reference.

import { describe, it, expect } from "vitest";
import request from "supertest";
import http from "http";
import { app } from "./index.ts";

describe("GET /", () => {
  it("returns a JSON greeting", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello World" });
  });
});
