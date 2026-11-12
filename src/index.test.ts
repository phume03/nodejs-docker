// Unit tests for the Express application.
// Tests the root endpoint without starting a server.
// See https://vitest.dev/ for the test framework reference.

import { describe, it, beforeEach, afterEach, afterAll, expect, vi } from "vitest";
import request from "supertest";
import http from "http";
import { app, pool } from "./index";

// Mock the pg module so it never tries to connect to a real database
vi.mock("pg", () => {
  const mPool = {
    query: vi.fn().mockResolvedValue({ rows: [] }),
    end: vi.fn().mockResolvedValue(undefined),
  };
  return { Pool: vi.fn(() => mPool) };
});

describe("GET /", () => {
  let server: http.Server;

  beforeEach( async () => {
    // Start a ephemeral server for testing
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, resolve);
    });
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  it("returns a JSON greeting", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello World" });
  });
});
