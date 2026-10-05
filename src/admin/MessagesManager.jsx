import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import Modal from "../components/ui/Modal";
import { COLLECTIONS } from "../firebase/firestore";
import { deleteItem, listAll, updateItem } from "../services/adminService";
import { byDateDesc, cn, formatDate, getFirebaseErrorMessage } from "../lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "handled", label: "Handled" },
];

const STATUS_LABEL = { unread: "Unread", read: "Read", handled: "Handled" };

export default function MessagesManager() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const list = await listAll(COLLECTIONS.messages);
      list.sort(byDateDesc((m) => m.createdAt));
      setItems(list);
      setStatus("ready");
    } catch (err) {
      setLoadError(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = items.filter((m) => m.status === "unread").length;

  const visible = useMemo(
    () => items.filter((m) => filter === "all" || m.status === filter),
    [items, filter]
  );

  const setMessageStatus = async (item, next) => {
    setBusyId(item.id);
    setError("");
    try {
      await updateItem(COLLECTIONS.messages, item.id, { status: next });
      setItems((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: next } : m))
      );
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const toggleOpen = (item) => {
    const opening = openId !== item.id;
    setOpenId(opening ? item.id : null);
    if (opening && item.status === "unread") setMessageStatus(item, "read");
  };

  const confirmDelete = async () => {
    const item = pendingDelete;
    setBusyId(item.id);
    setError("");
    try {
      await deleteItem(COLLECTIONS.messages, item.id);
      setItems((prev) => prev.filter((m) => m.id !== item.id));
      if (openId === item.id) setOpenId(null);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>

      <div role="group" aria-label="Filter messages" className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              filter === f.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
            {f.id === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState message={getFirebaseErrorMessage(loadError)} onRetry={load} />
        )}
        {status === "ready" && visible.length === 0 && (
          <EmptyState
            title={items.length === 0 ? "No messages yet." : "No messages in this view."}
          />
        )}

        {status === "ready" && visible.length > 0 && (
          <ul className="divide-y divide-border border-y border-border">
            {visible.map((item) => {
              const open = openId === item.id;
              const busy = busyId === item.id;
              return (
                <li key={item.id} className="py-3">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggleOpen(item)}
                    className="flex w-full items-start justify-between gap-4 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate",
                          item.status === "unread" ? "font-semibold" : "font-medium"
                        )}
                      >
                        {item.subject}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {item.name} · {formatDate(item.createdAt, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge variant={item.status === "unread" ? "accent" : "outline"}>
                        {STATUS_LABEL[item.status] ?? item.status}
                      </Badge>
                      <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={cn("transition-transform duration-150", open && "rotate-180")}
                      />
                    </span>
                  </button>

                  {open && (
                    <div className="mt-4 space-y-4 rounded-md bg-muted p-4">
                      <p className="text-sm">
                        <span className="text-muted-foreground">From: </span>
                        {item.name} &lt;{item.email}&gt;
                      </p>
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`}
                        >
                          Reply by email
                        </Button>
                        {item.status !== "handled" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={busy}
                            onClick={() => setMessageStatus(item, "handled")}
                          >
                            Mark as handled
                          </Button>
                        )}
                        {item.status !== "unread" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={busy}
                            onClick={() => setMessageStatus(item, "unread")}
                          >
                            Mark as unread
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          className="text-red-600 dark:text-red-400"
                          onClick={() => setPendingDelete(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this message?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          The message from {pendingDelete?.name} will be permanently deleted. This
          can't be undone.
        </p>
      </Modal>
    </div>
  );
}