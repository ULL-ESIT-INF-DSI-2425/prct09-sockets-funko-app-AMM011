import { describe, test, expect, beforeEach } from "vitest";
import { FunkoCollection } from "../src/models/FunkoCollection.js";
import { Funko } from "../src/models/Funko.js";
import { FunkoType } from "../src/models/FunkoType.js";
import { FunkoGenre } from "../src/models/FunkoGenre.js";

describe("FunkoCollectino", () => {
  let collection: FunkoCollection;
  let sonic: Funko;

  beforeEach(() => {
    collection = new FunkoCollection();
    sonic = new Funko(
      1,
      "Classic Sonic",
      "Best Sonic Funko ever",
      FunkoType.Pop,
      FunkoGenre.VideoGames,
      "Sonic the Hedgehog",
      1,
      false,
      "Brilla en la oscuridad",
      45,
    );
  });

  test("should add a new Funko", () => {
    const added = collection.addFunko(sonic);
    expect(added).toBe(true);
    expect(collection.listFunkos().length).toBe(1);
  });

  test("should not add a duplicate funko", () => {
    collection.addFunko(sonic);
    const addedAgain = collection.addFunko(sonic);
    expect(addedAgain).toBe(false);
    expect(collection.listFunkos().length).toBe(1);
  });

  test("should upadte an exisiting funko", () => {
    collection.addFunko(sonic);
    const updated = collection.updateFunko(
      new Funko(
        1,
        "Super Sonic",
        "Edición mejorada",
        FunkoType.Pop,
        FunkoGenre.VideoGames,
        "Sonic the Hedgehog",
        1,
        true,
        "Cabeza que se mueve",
        80,
      ),
    );
    expect(updated).toBe(true);
    const f = collection.getFunko(1);
    expect(f?.name).toBe("Super Sonic");
    expect(f?.marketValue).toBe(80);
  });

  test("should not update non-existent funko", () => {
    const updated = collection.updateFunko(sonic);
    expect(updated).toBe(false);
  });

  test("shoould remove an existing funko", () => {
    collection.addFunko(sonic);
    const removed = collection.removeFunko(1);
    expect(removed).toBe(true);
    expect(collection.listFunkos().length).toBe(0);
  });

  test("should not remove non-existent funko", () => {
    const removed = collection.removeFunko(999);
    expect(removed).toBe(false);
  });

  test("should get funko id", () => {
    collection.addFunko(sonic);
    const found = collection.getFunko(1);
    expect(found).not.toBeUndefined();
    expect(found?.name).toBe("Classic Sonic");
  });

  test("should return undefined for unknown funko", () => {
    const found = collection.getFunko(42);
    expect(found).toBeUndefined();
  });
});
