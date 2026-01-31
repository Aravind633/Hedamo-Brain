// "use client";

// import { Button } from "@/components/ui/button";
// import { GlassCard } from "@/components/ui/glass-card";
// import { Input } from "@/components/ui/input";
// import { LayoutGrid, Loader2 } from "lucide-react";
// import { useState } from "react";
// import { login, signup } from "../actions"; // We import the functions we made in Step 1

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(formData: FormData) {
//     setIsLoading(true);
//     setError(null);

//     // If 'isSignUp' is true, we run the signup function. Otherwise, we run login.
//     const action = isSignUp ? signup : login;
    
//     const result = await action(formData);
    
//     // If the server returns an error, we show it
//     if (result?.error) {
//       setError(result.error);
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
//       <GlassCard className="w-full max-w-md p-8 text-center" gradient>
        
//         {/* Logo */}
//         <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xl dark:bg-white dark:text-black">
//           <LayoutGrid size={24} />
//         </div>

//         <h1 className="mb-2 text-2xl font-semibold tracking-tight">
//           {isSignUp ? "Create Account" : "Welcome Back"}
//         </h1>
//         <p className="mb-8 text-sm text-neutral-500">
//           {isSignUp 
//             ? "Enter your details to get started." 
//             : "Enter your email and password to sign in."}
//         </p>

//         {/* Error Message */}
//         {error && (
//             <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-100">
//                 {error}
//             </div>
//         )}

//         <form action={handleSubmit} className="space-y-4 text-left">
//             <div>
//                 <Input 
//                     name="email" 
//                     type="email" 
//                     placeholder="Email address" 
//                     required 
//                     className="bg-white/50 dark:bg-black/50"
//                 />
//             </div>
//             <div>
//                 <Input 
//                     name="password" 
//                     type="password" 
//                     placeholder="Password" 
//                     required 
//                     minLength={6}
//                     className="bg-white/50 dark:bg-black/50"
//                 />
//             </div>

//             <Button 
//                 className="w-full mt-2" 
//                 size="lg" 
//                 disabled={isLoading}
//             >
//                 {isLoading ? (
//                     <Loader2 className="animate-spin" size={18} />
//                 ) : (
//                     isSignUp ? "Sign Up" : "Sign In"
//                 )}
//             </Button>
//         </form>

//         {/* Toggle Link */}
//         <div className="mt-6 text-sm text-neutral-500">
//             {isSignUp ? "Already have an account? " : "Don't have an account? "}
//             <button 
//                 type="button"
//                 onClick={() => {
//                   setIsSignUp(!isSignUp);
//                   setError(null);
//                 }}
//                 className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
//             >
//                 {isSignUp ? "Sign In" : "Sign Up"}
//             </button>
//         </div>

//       </GlassCard>
//     </div>
//   );
// }




"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Loader2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup } from "../actions";

// We separate the form logic to use 'useSearchParams' safely
function LoginForm() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If there is a success message from the URL, we make sure we are in "Login" mode
  useEffect(() => {
    if (successMessage) {
      setIsSignUp(false);
    }
  }, [successMessage]);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const action = isSignUp ? signup : login;
    const result = await action(formData);
    
    // The 'signup' action redirects, so we only get here if there is an error
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <GlassCard className="w-full max-w-md p-8 text-center" gradient>
      {/* Logo */}
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xl dark:bg-white dark:text-black">
        <LayoutGrid size={24} />
      </div>

      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h1>
      <p className="mb-8 text-sm text-neutral-500">
        {isSignUp 
          ? "Enter your details to get started." 
          : "Enter your email and password to sign in."}
      </p>

      {/* SUCCESS MESSAGE (Green) */}
      {successMessage && !isSignUp && !error && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400">
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE (Red) */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-100 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4 text-left">
        <div>
          <Input 
            name="email" 
            type="email" 
            placeholder="Email address" 
            required 
            className="bg-white/50 dark:bg-black/50"
          />
        </div>
        <div>
          <Input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required 
            minLength={6}
            className="bg-white/50 dark:bg-black/50"
          />
        </div>

        <Button className="w-full mt-2" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            isSignUp ? "Sign Up" : "Sign In"
          )}
        </Button>
      </form>

      {/* Toggle Link */}
      <div className="mt-6 text-sm text-neutral-500">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button 
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </GlassCard>
  );
}

// Main Page Component (Required for Next.js Suspense boundary)
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}