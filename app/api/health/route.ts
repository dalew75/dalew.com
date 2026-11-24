export const dynamic = 'force-dynamic'

/**
 * Liveness for deploys and probes. The droplet's warm-standby deploys (dalew75/droplet lib/slots.sh) start each
 * version in slot a or b with SITE_SLOT / SITE_SHA / SITE_BRANCH set, and check that the public URL reports the
 * new sha after switching. No data in the response.
 */
export function GET() {
  return Response.json({
    ok: true,
    slot: process.env.SITE_SLOT ?? null,
    sha: process.env.SITE_SHA ?? null,
    branch: process.env.SITE_BRANCH ?? null,
  })
}
