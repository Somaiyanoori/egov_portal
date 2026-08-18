import { useState } from "react";
import { Plus, Package, Edit2, Trash2, DollarSign, Clock } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatCurrency } from "@/lib/utils";
import { useAdminServices, useDeleteService } from "@/hooks/use-admin";
import { ServiceFormDialog } from "../components/service-form-dialog";
import type { Service } from "@/types";

export function ServicesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);

  const { data, isLoading } = useAdminServices({ limit: 100 });
  const deleteMutation = useDeleteService();

  const services = data?.data ?? [];

  const handleDelete = () => {
    if (!deleteService) return;
    deleteMutation.mutate(deleteService.id, {
      onSuccess: () => setDeleteService(null),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Configure available government services"
        action={
          <Button
            variant="gradient"
            onClick={() => {
              setEditService(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No services"
              description="Create your first service"
              action={
                <Button
                  variant="gradient"
                  onClick={() => {
                    setEditService(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Service
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-[color:var(--border)]">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-4 p-4 hover:bg-[color:var(--accent)]/30 transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium truncate">{service.name}</h4>
                      {service.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[color:var(--muted-foreground)] flex-wrap">
                      <span>{service.department?.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {Number(service.fee) > 0
                          ? `${formatCurrency(Number(service.fee))} AFN`
                          : "Free"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {service.processingDays} days
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditService(service);
                        setFormOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteService(service)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        service={editService}
      />

      <ConfirmDialog
        open={!!deleteService}
        onOpenChange={(open) => !open && setDeleteService(null)}
        title="Delete Service"
        description={`Delete "${deleteService?.name}"? This will fail if there are linked requests.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
