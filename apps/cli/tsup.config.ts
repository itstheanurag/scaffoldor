import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  // Bundle @repo/schema into the output since it's a workspace dependency
  // that won't be available when installed from npm
  noExternal: ["@repo/schema"],
});
