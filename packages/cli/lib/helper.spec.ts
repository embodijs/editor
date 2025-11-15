import { describe, test, expect } from "vitest";
import { resolveRelativePath } from "./helper";

describe("resolveRelativePath", () => {
  test("No ./ or ../", () => {
    const result = resolveRelativePath("test", "home/user");
    expect(result).toBe("home/user");
  });

  test("Subpath", () => {
    const result = resolveRelativePath("test", "./home/user");
    expect(result).toBe("test/home/user");
  });

  test("other dir", () => {
    const result = resolveRelativePath("test/more/deep", "../other/dir");
    expect(result).toBe("test/more/other/dir");
  });
});
