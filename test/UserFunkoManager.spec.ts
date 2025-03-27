import { describe, test, expect, beforeEach, afterAll } from "vitest";
import { UserFunkoManager } from "../src/storage/UserFunkoManager.js";
import { Funko } from "../src/models/Funko.js";
import { FunkoType } from "../src/models/FunkoType.js";
import { FunkoGenre } from "../src/models/FunkoGenre.js";
import * as fs from "fs/promises";
import * as path from "path";

const TEST_USER = "testuser";
const TEST_DIR = path.join("db", TEST_USER);

describe("UserFunkoManager", () => {
  let manager: UserFunkoManager;
  let sonic: Funko;

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
    manager = new UserFunkoManager(TEST_USER);
    sonic = new Funko(
      1,
      "Test Sonic",
      "Funko de prueba",
      FunkoType.Pop,
      FunkoGenre.VideoGames,
      "Sonic",
      1,
      false,
      "Glow",
      40,
    );
    await manager.load();
  });

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  test("should add and persist a funko", async () => {
    const added = await manager.add(sonic);
    expect(added).toBe(true);

    // Verificamos que el archivo existe
    const filePath = path.join(TEST_DIR, "1.json");
    const exists = await fs.readFile(filePath, "utf-8");
    expect(JSON.parse(exists).name).toBe("Test Sonic");
  });

  test("should not add duplicate funko", async () => {
    await manager.add(sonic);
    const again = await manager.add(sonic);
    expect(again).toBe(false);
  });

  test("should update a funko and persist changes", async () => {
    await manager.add(sonic);
    const updated = await manager.update(
      new Funko(
        1,
        "Super Sonic",
        "Modificado",
        FunkoType.Pop,
        FunkoGenre.VideoGames,
        "Sonic",
        1,
        true,
        "Special",
        100,
      ),
    );
    expect(updated).toBe(true);

    const read = await fs.readFile(path.join(TEST_DIR, "1.json"), "utf-8");
    expect(JSON.parse(read).name).toBe("Super Sonic");
  });

  test("should remove a funko and delete file", async () => {
    await manager.add(sonic);
    const removed = await manager.remove(1);
    expect(removed).toBe(true);

    const filePath = path.join(TEST_DIR, "1.json");
    await expect(fs.access(filePath)).rejects.toThrow();
  });

  test("should list and retrieve funkos", async () => {
    await manager.add(sonic);
    const all = manager.list();
    expect(all.length).toBe(1);

    const found = manager.get(1);
    expect(found?.name).toBe("Test Sonic");
  });
});
