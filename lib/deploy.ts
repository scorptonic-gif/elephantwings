/**
 * Triggers a Vercel deploy hook after a successful save.
 * Fire-and-forget — never throws, so it won't block the save response.
 */
export async function triggerDeploy(): Promise<void> {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hookUrl) return // silently skip if not configured
  try {
    await fetch(hookUrl, { method: 'POST' })
  } catch {
    // non-fatal — content is already saved to Supabase
  }
}
