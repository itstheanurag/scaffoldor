import { syncRegistry } from "../registry";
import { UI } from "../helpers/ui";

export async function syncCommand() {
  UI.info("Syncing from remote registry...");

  const success = await syncRegistry();

  if (success) {
    UI.success("Registry synced successfully!");
  } else {
    UI.error("Failed to sync registry. Check your internet connection.");
  }
}
