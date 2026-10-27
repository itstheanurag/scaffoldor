import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version?: string };

/**
 * Package version, read at runtime so `scaffoldor --version` can never drift
 * from the version that was actually published.
 */
export const VERSION = pkg.version ?? "0.0.0";
