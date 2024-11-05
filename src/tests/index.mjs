import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  process.exit(0);
}

const execSync = (await import("child_process")).execSync;
execSync("yarn vitest", { stdio: "inherit" });
