/**
 * Prompt helpers.
 *
 * Interactive prompts are only safe when stdin/stdout are attached to a
 * terminal. When the CLI runs in CI, from a pipe, or with `--yes`, commands
 * fall back to sensible defaults instead of hanging forever.
 */
export function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

export function canPrompt(options: { yes?: boolean } = {}): boolean {
  return !options.yes && isInteractive();
}
