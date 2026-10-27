import { syncRegistry, REMOTE_REGISTRY_URL } from "../registry";
import { UI } from "../helpers/ui";
import { CliError } from "../helpers/errors";

export async function syncCommand() {
  UI.info("Syncing from remote registry...");
  UI.dim(REMOTE_REGISTRY_URL);

  const result = await syncRegistry();

  if (!result.ok) {
    throw new CliError(
      `Failed to sync registry.${result.error ? `\n${result.error}` : ""}`,
    );
  }

  UI.success(
    `Registry synced successfully! ${result.total} template(s) available.`,
  );

  if (result.preserved > 0) {
    UI.dim(
      `Preserved ${result.preserved} locally added template(s) under @local.`,
    );
  }
}
