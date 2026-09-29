/**
 * Creates the owner account and registers it in owner_accounts.
 *
 * Run with:  node --env-file=.env.local scripts/create-owner.mjs <email> <password>
 *
 * A Supabase user alone is not enough to reach the admin — getOwner() also
 * requires a row in owner_accounts, so signing up through any other route
 * grants nothing.
 */
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/create-owner.mjs <email> <password>");
  process.exit(1);
}
if (password.length < 12) {
  console.error("Use a password of at least 12 characters.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const { data: created, error: createError } = await db.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

let userId = created?.user?.id;

if (createError) {
  if (!/already/i.test(createError.message)) {
    console.error("Could not create user:", createError.message);
    process.exit(1);
  }
  // Already exists — find them so the script stays re-runnable.
  const { data: list } = await db.auth.admin.listUsers();
  userId = list?.users?.find((u) => u.email === email)?.id;
  if (!userId) {
    console.error("User exists but could not be found.");
    process.exit(1);
  }
  console.log("User already existed; registering as owner.");
}

const { error: ownerError } = await db
  .from("owner_accounts")
  .upsert({ user_id: userId, email }, { onConflict: "user_id" });

if (ownerError) {
  console.error("Could not register owner:", ownerError.message);
  process.exit(1);
}

console.log(`Owner ready: ${email}`);
