/**
 * Exports every row from the current Supabase project to a JSON file.
 *
 * Run with:
 *   node --env-file=.env.local scripts/export-data.mjs
 *
 * Writes supabase/export.json, which import-data.mjs then loads into the new
 * project. Both scripts exist so the migration is repeatable and reviewable
 * rather than a one-off set of ad-hoc commands.
 */
import { writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY first.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// Order matters on import: parents before the rows that reference them.
const TABLES = [
  "business_settings",
  "invoice_counter",
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

const out = { exportedAt: new Date().toISOString(), source: url, tables: {} };

for (const table of TABLES) {
  const { data, error } = await db.from(table).select("*");
  if (error) {
    console.error(`  ${table}: FAILED — ${error.message}`);
    process.exit(1);
  }
  out.tables[table] = data ?? [];
  console.log(`  ${table.padEnd(18)} ${data?.length ?? 0} rows`);
}

// Auth users are not ordinary table rows, so they are captured separately.
// Passwords cannot be exported; the owner resets theirs after the move, and
// clients sign in by emailed link anyway.
const { data: users, error: userError } = await db.auth.admin.listUsers();
if (userError) {
  console.error(`  auth.users: FAILED — ${userError.message}`);
  process.exit(1);
}

out.authUsers = users.users.map((u) => ({
  id: u.id,
  email: u.email,
  email_confirmed_at: u.email_confirmed_at,
}));
console.log(`  auth.users         ${out.authUsers.length} users`);

writeFileSync("supabase/export.json", JSON.stringify(out, null, 2));
console.log("\n  written to supabase/export.json");
