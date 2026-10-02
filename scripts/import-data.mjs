/**
 * Loads supabase/export.json into a new Supabase project.
 *
 * Run with the NEW project's credentials:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SECRET_KEY=sb_secret_xxx \
 *   node scripts/import-data.mjs
 *
 * Run the migrations in supabase/migrations first — this only moves data, not
 * schema.
 *
 * Safe to re-run: every insert upserts on the primary key, so a partial run
 * can be repeated without duplicating rows.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY first.");
  process.exit(1);
}

const dump = JSON.parse(readFileSync("supabase/export.json", "utf8"));

if (dump.source === url) {
  console.error("Refusing to import into the same project it came from.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// Auth users first: clients.auth_user_id references them, and the ids must
// match or portal access breaks.
console.log("  auth users");
const existing = await db.auth.admin.listUsers();
const seen = new Set(existing.data.users.map((u) => u.email));

for (const user of dump.authUsers ?? []) {
  if (seen.has(user.email)) {
    console.log(`    ${user.email} — already present`);
    continue;
  }
  const { error } = await db.auth.admin.createUser({
    // Preserving the id keeps clients.auth_user_id valid without rewriting it.
    id: user.id,
    email: user.email,
    email_confirm: Boolean(user.email_confirmed_at),
  });
  console.log(`    ${user.email} — ${error ? "FAILED: " + error.message : "created"}`);
}

// Single-row config tables are updated rather than inserted; the migration
// already seeded exactly one row in each.
for (const table of ["business_settings", "invoice_counter"]) {
  const rows = dump.tables[table] ?? [];
  if (rows.length === 0) continue;
  const { error } = await db.from(table).update(rows[0]).eq("id", true);
  console.log(`  ${table.padEnd(18)} ${error ? "FAILED: " + error.message : "updated"}`);
}

const ORDER = [
  "leads",
  "clients",
  "projects",
  "project_brief",
  "invoices",
  "invoice_lines",
  "messages",
  "owner_accounts",
  "audit_log",
];

for (const table of ORDER) {
  const rows = dump.tables[table] ?? [];
  if (rows.length === 0) {
    console.log(`  ${table.padEnd(18)} 0 rows — skipped`);
    continue;
  }

  // project_brief is keyed by project_id; audit_log by a bigserial id that
  // should be left to regenerate rather than forced.
  const conflict =
    table === "project_brief" ? "project_id" : table === "owner_accounts" ? "user_id" : "id";

  const payload =
    table === "audit_log" ? rows.map(({ id, ...rest }) => rest) : rows;

  const { error } =
    table === "audit_log"
      ? await db.from(table).insert(payload)
      : await db.from(table).upsert(payload, { onConflict: conflict });

  console.log(
    `  ${table.padEnd(18)} ${rows.length} rows — ${error ? "FAILED: " + error.message : "ok"}`,
  );
}

console.log("\n  import complete");
