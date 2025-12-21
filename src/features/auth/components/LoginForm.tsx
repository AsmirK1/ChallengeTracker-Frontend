import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useNavigate } from "react-router-dom";
import { loginAction, type ActionState } from "../actions";
import { Button } from "@/shared/components/ui/components/Button";
import { HoneypotInput } from "@/shared/components/ui/components/HoneypotInput";

// Initial state for login action
const initialState: ActionState = {
  success: false,
  message: "",
  errors: {},
  inputs: {},
};

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20"
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

// Login form component
export const LoginForm = () => {
  const navigate = useNavigate();
  const [state, action] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await loginAction(prev, formData);
      if (result.success) {
        navigate("/dashboard");
      }
      return result;
    },
    initialState
  );

  return (
    <main className="bg-transparent text-slate-100 px-4 py-15">
      <section className="w-full max-w-md mx-auto rounded-2xl border border-slate-800/60 bg-slate-950/40 p-8 shadow-2xl shadow-black/20">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
          Login
        </h1>
        <p className="text-sm text-slate-400 text-center mb-8">
          Welcome back! Enter your details to sign in.
        </p>

        {state.message && !state.success && (
          <p className="mb-4 text-sm text-red-400" role="alert">
            {state.message}
          </p>
        )}

        <form className="space-y-4" action={action} autoComplete="off">
          {/* Honeypot field for bot detection */}
          <HoneypotInput />

          <div className="space-y-1">
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              defaultValue={state.inputs?.email as string}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="you@example.com"
            />
            {state.errors?.email && (
              <p className="text-xs text-red-400">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-1">
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="••••••••"
            />
            {state.errors?.password && (
              <p className="text-xs text-red-400">{state.errors.password[0]}</p>
            )}
          </div>

          <SubmitButton />
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Create one
          </a>
        </p>
      </section>
    </main>
  );
};
