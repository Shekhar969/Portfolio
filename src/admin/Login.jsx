import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Seo from "../components/Seo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../firebase/auth";
import { ROUTES } from "../lib/constants";

export default function Login() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingState />;
  if (isAdmin) {
    return <Navigate to={location.state?.from || ROUTES.admin} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <Seo title="Admin sign in" noIndex />
      <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>

      {user && !isAdmin ? (
        <div className="mt-6 space-y-4">
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            This account isn't authorized to use the admin area.
          </p>
          <Button variant="secondary" onClick={signOut}>
            Sign out
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      )}
    </div>
  );
}