import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import Modal from "../components/ui/Modal";
import ResourceForm from "./ResourceForm";
import {
  createItem,
  deleteItem,
  listAll,
  updateItem,
} from "../services/adminService";
import { byDateDesc, getFirebaseErrorMessage } from "../lib/utils";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function ResourceManager({ resource }) {
  const {
    collection: name,
    plural,
    singular,
    fields,
    reorder,
    titleKey,
    subtitleKey,
    featuredToggle,
  } = resource;

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(null); // { item } while editing or creating
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const list = await listAll(name);
      list.sort(
        reorder
          ? (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
          : byDateDesc((i) => i.createdAt)
      );
      setItems(list);
      setStatus("ready");
    } catch (error) {
      setLoadError(error);
      setStatus("error");
    }
  }, [name, reorder]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data) => {
    setSaving(true);
    setSaveError("");
    try {
      if (form.item) await updateItem(name, form.item.id, data);
      else await createItem(name, data);
      setForm(null);
      setNotice(`${capitalize(singular)} saved.`);
      await load();
    } catch (error) {
      setSaveError(getFirebaseErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const patch = async (item, changes) => {
    setBusyId(item.id);
    setActionError("");
    setNotice("");
    try {
      await updateItem(name, item.id, changes);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ...changes } : i))
      );
    } catch (error) {
      setActionError(getFirebaseErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    const renumbered = next.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    const changed = renumbered.filter((item, i) => item.sortOrder !== next[i].sortOrder);

    setActionError("");
    setNotice("");
    try {
      await Promise.all(
        changed.map((item) => updateItem(name, item.id, { sortOrder: item.sortOrder }))
      );
      setItems(renumbered);
    } catch (error) {
      setActionError(getFirebaseErrorMessage(error));
    }
  };

  const confirmDelete = async () => {
    const item = pendingDelete;
    setBusyId(item.id);
    setActionError("");
    try {
      await deleteItem(name, item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setNotice(`${capitalize(singular)} deleted.`);
    } catch (error) {
      setActionError(getFirebaseErrorMessage(error));
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  };

  if (form) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          {form.item ? `Edit ${singular}` : `New ${singular}`}
        </h1>
        <ResourceForm
          key={form.item?.id ?? "new"}
          resource={resource}
          item={form.item}
          items={items}
          saving={saving}
          error={saveError}
          onSubmit={handleSave}
          onCancel={() => {
            setForm(null);
            setSaveError("");
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{plural}</h1>
        <Button
          onClick={() => {
            setNotice("");
            setForm({ item: null });
          }}
        >
          New {singular}
        </Button>
      </div>

      {notice && (
        <p role="status" className="mt-4 text-sm text-accent">
          {notice}
        </p>
      )}
      {actionError && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {actionError}
        </p>
      )}

      <div className="mt-6">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState message={getFirebaseErrorMessage(loadError)} onRetry={load} />
        )}
        {status === "ready" && items.length === 0 && (
          <EmptyState
            title={`No ${plural.toLowerCase()} yet.`}
            actionLabel={`Add your first ${singular}`}
            onAction={() => setForm({ item: null })}
          />
        )}
        {status === "ready" && items.length > 0 && (
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item, index) => {
              const busy = busyId === item.id;
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {item[titleKey] || "(untitled)"}
                    </p>
                    {subtitleKey && item[subtitleKey] && (
                      <p className="truncate text-sm text-muted-foreground">
                        {item[subtitleKey]}
                      </p>
                    )}
                    <div className="mt-1.5 flex gap-2">
                      <Badge variant={item.published ? "accent" : "outline"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                      {item.featured && <Badge>Featured</Badge>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {reorder && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Move ${item[titleKey]} up`}
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                        >
                          <ChevronUp size={16} aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Move ${item[titleKey]} down`}
                          disabled={index === items.length - 1}
                          onClick={() => move(index, 1)}
                        >
                          <ChevronDown size={16} aria-hidden="true" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setNotice("");
                        setForm({ item });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => patch(item, { published: !item.published })}
                    >
                      {item.published ? "Unpublish" : "Publish"}
                    </Button>
                    {featuredToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() => patch(item, { featured: !item.featured })}
                      >
                        {item.featured ? "Unfeature" : "Feature"}
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
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={`Delete this ${singular}?`}
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
          “{pendingDelete?.[titleKey] || "This item"}” will be permanently deleted.
          This can't be undone.
        </p>
      </Modal>
    </div>
  );
}