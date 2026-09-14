import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";

const apiDir = new URL("../app/api", import.meta.url);
const hiddenApiDir = new URL("../app/_api.netlify-disabled", import.meta.url);

let moved = false;

try {
  if (existsSync(apiDir) && !existsSync(hiddenApiDir)) {
    renameSync(apiDir, hiddenApiDir);
    moved = true;
  }

  const result = spawnSync("next", ["build", "--webpack"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  if (moved && existsSync(hiddenApiDir)) {
    renameSync(hiddenApiDir, apiDir);
  }
}
