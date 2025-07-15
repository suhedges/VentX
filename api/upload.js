// GitHub Pages Functions (beta) – Edge runtime
export const onRequestPost = async ({ request, env }) => {
  try {
    const data = await request.json();              // {user, warehouses, items, ...}

    // 1️⃣  Put the bundle into KV with versioned key
    const key = `${data.user}-${Date.now()}.json`;
    await env.VENTX_BACKUPS.put(key, JSON.stringify(data));

    // 2️⃣  Keep a "latest" pointer for easy download
    await env.VENTX_BACKUPS.put(`${data.user}-latest`, JSON.stringify(data));

    // 3️⃣  Optionally write static file in repo (for browser GET):
    //      This requires a GitHub PAT stored in env.GH_TOKEN and simple REST call.
    //      (Omitted here for brevity.)

    /*  Respond with per-warehouse versions so the client can detect conflicts
        and ask whether the user wants to overwrite.  Your real back-end
        should look up the latest versions it has stored. */
    return new Response(
      JSON.stringify({ ok: true, latestVersions: {} }),
      { headers: { "content-type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};
