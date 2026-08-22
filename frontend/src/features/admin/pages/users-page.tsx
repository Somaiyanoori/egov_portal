import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Edit2, Trash2, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/shared/role-badge";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { getInitials, debounce } from "@/lib/utils";
import { getDateLocale } from "@/lib/i18n-helpers";
import { useUsers, useDeleteUser } from "@/hooks/use-admin";
import { UserFormDialog } from "../components/user-form-dialog";
import type { User } from "@/types";

export function UsersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const debouncedSearch = debounce((v: string) => setSearch(v), 500);
  const { data, isLoading } = useUsers({
    page,
    limit: 10,
    search: search || undefined,
  });
  const deleteMutation = useDeleteUser();

  const users = data?.data ?? [];
  const meta = data?.meta;

  const handleEdit = (user: User) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleteUser) return;
    deleteMutation.mutate(deleteUser.id, {
      onSuccess: () => setDeleteUser(null),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.title")}
        description={t("users.manageUsers")}
        action={
          <Button variant="gradient" onClick={handleCreate}>
            <UserPlus className="h-4 w-4" />
            {t("users.addUser")}
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder={t("users.searchPlaceholder")}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title={t("users.noUsers")}
              description={t("users.tryAdjusting")}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[color:var(--border)] bg-[color:var(--muted)]/30">
                    <th className="text-left rtl:text-right p-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {t("users.user")}
                    </th>
                    <th className="text-left rtl:text-right p-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {t("users.userRole")}
                    </th>
                    <th className="text-left rtl:text-right p-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {t("users.department")}
                    </th>
                    <th className="text-left rtl:text-right p-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {t("users.status")}
                    </th>
                    <th className="text-left rtl:text-right p-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {t("users.joined")}
                    </th>
                    <th className="text-right rtl:text-left p-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--accent)]/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {user.name}
                            </div>
                            <div className="text-xs text-[color:var(--muted-foreground)] truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="p-4 text-sm">
                        {user.department?.name ?? (
                          <span className="text-[color:var(--muted-foreground)]">
                            —
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {user.isActive ? (
                          <Badge variant="success">{t("common.active")}</Badge>
                        ) : (
                          <Badge variant="secondary">
                            {t("common.inactive")}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-sm text-[color:var(--muted-foreground)]">
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                          locale: getDateLocale(),
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEdit(user)}
                            title={t("common.edit")}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteUser(user)}
                            title={t("common.delete")}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            {t("common.showing")} {(meta.page - 1) * meta.limit + 1}{" "}
            {t("common.to")} {Math.min(meta.page * meta.limit, meta.total)}{" "}
            {t("common.of")} {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrev}
              onClick={() => setPage(page - 1)}
            >
              {t("common.previous")}
            </Button>
            <span className="text-sm px-2">
              {meta.page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNext}
              onClick={() => setPage(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editUser}
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title={t("users.deleteUser")}
        description={t("users.deleteConfirm", { name: deleteUser?.name ?? "" })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
