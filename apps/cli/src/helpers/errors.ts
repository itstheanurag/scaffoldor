/**
 * Error types and helpers shared by all CLI commands.
 *
 * Commands throw a `CliError` for expected failures (bad input, missing
 * template, failed clone, ...). The entry point catches them and prints a
 * concise message instead of an unhandled promise rejection or a raw stack
 * trace.
 */
export class CliError extends Error {
  readonly exitCode: number;

  constructor(message: string, exitCode = 1) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
  }
}

/**
 * Inquirer throws when the user presses Ctrl+C. Detect it across the
 * different error shapes used by inquirer versions.
 */
export function isPromptCancellation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const name = error.name.toLowerCase();
  const message = error.message.toLowerCase();

  return (
    name === "exitprompterror" ||
    name === "cancelprompterror" ||
    message.includes("force closed") ||
    message.includes("prompt was canceled")
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred.";
}
