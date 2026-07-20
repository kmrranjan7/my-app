"use client";

import { Pencil, Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import { API_BASE_URL } from "@/lib/apiConfig";
import { Badge, Card, GhostButton, SectionHeading } from "@/components/dashboard/ui";

type AuthApiResponse<T> = Readonly<{
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
}>;

type UserRecord = Readonly<{
  readonly id: number;
  readonly username: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}>;

const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function callAuthApi<T>(path: string, init: RequestInit): Promise<AuthApiResponse<T>> {
  const headers = {
    "Content-Type": "application/json",
    ...init.headers,
  };

  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const payload = await readJson<AuthApiResponse<T> & { message?: string }>(response);
  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed.");
  }

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? "Success",
    data: (payload?.data ?? null) as T,
  };
}

function toLocalDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

export default function ProfileManagementPanel() {
  const [users, setUsers] = useState<ReadonlyArray<UserRecord>>([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [editingUsername, setEditingUsername] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState("");
  const [pendingDeleteUsername, setPendingDeleteUsername] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const usersCountLabel = useMemo(() => `${users.length} users`, [users.length]);

  const runAction = async (action: () => Promise<void>) => {
    setIsWorking(true);
    setErrorMessage(null);
    try {
      await action();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error.");
    } finally {
      setIsWorking(false);
    }
  };

  const refreshUsers = async () => {
    const payload = await callAuthApi<ReadonlyArray<UserRecord>>("/users", {
      method: "GET",
    });
    setUsers(payload.data ?? []);
    setStatusMessage(payload.message);
  };

  const onFetchAllUsers = () => {
    void runAction(refreshUsers);
  };

  const onOpenCreateRow = () => {
    setIsCreateMode(true);
    setCreateUsername("");
    setCreatePassword("");
  };

  const onSaveNewUser = () => {
    if (!createUsername.trim() || !createPassword.trim()) {
      setErrorMessage("Username and password are required to create a user.");
      return;
    }

    void runAction(async () => {
      const payload = await callAuthApi<{ username: string }>("/register", {
        method: "POST",
        body: JSON.stringify({ username: createUsername.trim(), password: createPassword }),
      });
      setStatusMessage(payload.message);
      setIsCreateMode(false);
      setCreateUsername("");
      setCreatePassword("");
      await refreshUsers();
    });
  };

  const onDeleteUserByName = (username: string) => {
    if (!username.trim()) {
      setErrorMessage("Username is required to delete a user.");
      return;
    }

    setPendingDeleteUsername(username);
  };

  const onConfirmDelete = () => {
    if (!pendingDeleteUsername) {
      return;
    }

    void runAction(async () => {
      const username = pendingDeleteUsername;
      const payload = await callAuthApi<null>(`/users/${encodeURIComponent(username)}`, {
        method: "DELETE",
      });
      setStatusMessage(payload.message);
      if (editingUsername === username) {
        setEditingUsername(null);
        setEditingPassword("");
      }
      setPendingDeleteUsername(null);
      await refreshUsers();
    });
  };

  const onCancelDelete = () => {
    setPendingDeleteUsername(null);
  };

  const onStartUpdate = (username: string) => {
    setEditingUsername(username);
    setEditingPassword("");
  };

  const onSaveUpdate = (username: string) => {
    if (!editingPassword.trim()) {
      setErrorMessage("Password is required to update the user.");
      return;
    }

    void runAction(async () => {
      const payload = await callAuthApi<null>(`/users/${encodeURIComponent(username)}/password`, {
        method: "PUT",
        body: JSON.stringify({ newPassword: editingPassword }),
      });
      setStatusMessage(payload.message);
      setEditingUsername(null);
      setEditingPassword("");
      await refreshUsers();
    });
  };

  return (
    <Card className="space-y-5 p-4">
      <SectionHeading
        title="User Management"
        subtitle="Create users inline, update password, and delete rows from a premium admin table."
        action={<Badge label={isWorking ? "Working" : "Idle"} variant={isWorking ? "info" : "success"} />}
      />

      <section className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Users Table</h3>
          <Badge label={usersCountLabel} variant="neutral" />
        </div>
        <div className="flex flex-wrap gap-2">
          <GhostButton label="Fetch Users" onClick={onFetchAllUsers} disabled={isWorking} />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
            onClick={onOpenCreateRow}
            disabled={isWorking || isCreateMode}
          >
            <Plus className="h-4 w-4" /> New
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300"
            onClick={onFetchAllUsers}
            disabled={isWorking}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Status: {statusMessage}</p>
        {errorMessage ? <p className="text-sm font-medium text-rose-600">Error: {errorMessage}</p> : null}

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Username</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Password</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Created</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300">Updated</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isCreateMode ? (
                <tr className="bg-emerald-50/60 dark:bg-emerald-950/15">
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">new</td>
                  <td className="px-3 py-2">
                    <input
                      value={createUsername}
                      onChange={(event) => setCreateUsername(event.target.value)}
                      placeholder="username"
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={createPassword}
                      onChange={(event) => setCreatePassword(event.target.value)}
                      placeholder="password"
                      type="password"
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">-</td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">-</td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-100 px-2 py-1 text-emerald-700 hover:bg-emerald-200 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                        onClick={onSaveNewUser}
                        disabled={isWorking}
                      >
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        onClick={() => setIsCreateMode(false)}
                        disabled={isWorking}
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : null}

              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{user.id}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{user.username}</td>
                  <td className="px-3 py-2">
                    {editingUsername === user.username ? (
                      <input
                        value={editingPassword}
                        onChange={(event) => setEditingPassword(event.target.value)}
                        placeholder="new password"
                        type="password"
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                      />
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">********</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{toLocalDate(user.createdAt)}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{toLocalDate(user.updatedAt)}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      {editingUsername === user.username ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-100 px-2 py-1 text-emerald-700 hover:bg-emerald-200 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                          onClick={() => onSaveUpdate(user.username)}
                          disabled={isWorking}
                        >
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
                          onClick={() => onStartUpdate(user.username)}
                          disabled={isWorking}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Update
                        </button>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                        onClick={() => onDeleteUserByName(user.username)}
                        disabled={isWorking}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">
                    No users loaded. Use GET /api/auth/users.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {pendingDeleteUsername ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">Confirm Delete</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete user <span className="font-semibold text-slate-900 dark:text-slate-200">{pendingDeleteUsername}</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                onClick={onCancelDelete}
                disabled={isWorking}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                onClick={onConfirmDelete}
                disabled={isWorking}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
