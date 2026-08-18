import { useState } from "react";
import { Plus, Building2, Edit2, Trash2, Users, Package } from "lucide-react";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDepartments, useDeleteDepartment } from "@/hooks/use-admin";
import { DepartmentFormDialog } from "../components/department-form-dialog";
import type { Department } from "@/types";

export function DepartmentsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteDept, setDeleteDept] = useState<Department | null>(null);

  const { data, isLoading } = useDepartments({ limit: 100 });
  const deleteMutation = useDeleteDepartment();

  const departments = data?.data ?? [];

  const handleDelete = () => {
    if (!deleteDept) return;
    deleteMutation.mutate(deleteDept.id, {
      onSuccess: () => setDeleteDept(null),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage government departments"
        action={
          <Button
            variant="gradient"
            onClick={() => {
              setEditDept(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Building2}
              title="No departments"
              description="Create your first department to get started"
              action={
                <Button
                  variant="gradient"
                  onClick={() => {
                    setEditDept(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Department
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-brand-500" />
                    </div>
                    {dept.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>

                  <div className="mb-2">
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    {dept.code && (
                      <p className="text-xs font-mono text-[color:var(--muted-foreground)] mt-0.5">
                        {dept.code}
                      </p>
                    )}
                  </div>

                  {dept.description && (
                    <p className="text-sm text-[color:var(--muted-foreground)] mb-4 line-clamp-2">
                      {dept.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-[color:var(--border)] text-sm">
                    <div className="flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
                      <Users className="h-4 w-4" />
                      <span>{dept._count?.users ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
                      <Package className="h-4 w-4" />
                      <span>{dept._count?.services ?? 0}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditDept(dept);
                          setFormOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteDept(dept)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={editDept}
      />

      <ConfirmDialog
        open={!!deleteDept}
        onOpenChange={(open) => !open && setDeleteDept(null)}
        title="Delete Department"
        description={`Delete "${deleteDept?.name}"? This will fail if there are users or services assigned.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
