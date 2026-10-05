import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { COLLECTIONS } from "../firebase/firestore";
import { listAll } from "../services/adminService";
import { ROUTES } from "../lib/constants";
import { byDateDesc, formatDate, getFirebaseErrorMessage } from "../lib/utils";
import ImportContent from "./ImportContent";

function Stat({ label, value, to }) {
  return (
    <Link
      to={to}
      className="rounded-md border border-border p-4 transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </Link>
  );
}

export default function Dashboard() {
  const [state, setState] = useState({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const [projects, messages] = await Promise.all([
        listAll(COLLECTIONS.projects),
        listAll(COLLECTIONS.messages),
      ]);
      messages.sort(byDateDesc((m) => m.createdAt));
      setState({ status: "ready", projects, messages });
    } catch (error) {
      setState({ status: "error", error });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <ImportContent onDone={load} />

      <div className="mt-6">
        {state.status === "loading" && <LoadingState />}
        {state.status === "error" && (
          <ErrorState message={getFirebaseErrorMessage(state.error)} onRetry={load} />
        )}

        {state.status === "ready" && (
          <>
            {(() => {
              const { projects, messages } = state;
              const published = projects.filter((p) => p.published).length;
              const unread = messages.filter((m) => m.status === "unread").length;
              return (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Stat label="Total projects" value={projects.length} to={`${ROUTES.admin}/projects`} />
                  <Stat label="Published projects" value={published} to={`${ROUTES.admin}/projects`} />
                  <Stat label="Draft projects" value={projects.length - published} to={`${ROUTES.admin}/projects`} />
                  <Stat label="Unread messages" value={unread} to={`${ROUTES.admin}/messages`} />
                </div>
              );
            })()}

            <h2 className="mb-3 mt-10 text-lg font-semibold tracking-tight">
              Latest messages
            </h2>
            {state.messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-border border-y border-border">
                {state.messages.slice(0, 3).map((m) => (
                  <li key={m.id} className="py-3">
                    <Link
                      to={`${ROUTES.admin}/messages`}
                      className="block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="block truncate font-medium">{m.subject}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {m.name} · {formatDate(m.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}