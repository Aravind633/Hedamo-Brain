// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

// export async function login(formData: FormData) {
//   const supabase = await createClient();
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   // This checks the password against the database
//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   revalidatePath("/", "layout");
//   redirect("/");
// }

// export async function signup(formData: FormData) {
//   const supabase = await createClient();
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   // This creates a new user in the database
//   const { error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) {
//     return { error: error.message };
//   }

//   revalidatePath("/", "layout");
//   redirect("/");
// }


"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Create the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // 2. CRITICAL CHANGE: Force Logout immediately
  // (Supabase sometimes auto-logs in if 'Confirm Email' is off. We prevent that.)
  await supabase.auth.signOut();

  // 3. Redirect back to Login Page with a success parameter
  redirect("/login?success=Account created! Please log in.");
}