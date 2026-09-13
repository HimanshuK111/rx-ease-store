import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderListSkeleton } from "@/components/Skeletons";
import { currency } from "@/lib/cart";
import { apiClient } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — MediCare Pharmacy" },
      {
        name: "description",
        content:
          "Track your medicine orders and prescription verification status.",
      },
      {
        property: "og:title",
        content: "My Orders — MediCare Pharmacy",
      },
      {
        property: "og:description",
        content:
          "Track your medicine orders and prescription verification status.",
      },
    ],
  }),
  component: OrdersPage,
});

const statusLabels: Record<string, string> = {
  placed: "Placed",
  awaiting_verification: "Awaiting pharmacist verification",
  dispensed: "Dispensed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: apiClient.orders.list,
  });

  const [openingPrescription, setOpeningPrescription] =
    useState<string | null>(null);

  const handleViewPrescription = async (orderId: string) => {
    try {
      setOpeningPrescription(orderId);

      const token = window.localStorage.getItem(
        "rxease.access_token",
      );

      if (!token) {
        toast.error("Please sign in again.");
        return;
      }

      const response = await fetch("/api/prescription-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;

        throw new Error(
          body?.detail ?? "Could not open prescription",
        );
      }

      const { presignedUrl } = (await response.json()) as {
        presignedUrl: string;
      };

      window.open(
        presignedUrl,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not open prescription",
      );
    } finally {
      setOpeningPrescription(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Order History
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          My orders
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your medicine orders and prescription verification
          status.
        </p>
      </header>

      {isLoading && <OrderListSkeleton count={3} />}

      {error && (
        <p className="mt-8 text-sm text-destructive">
          We couldn't load your orders. Please refresh.
        </p>
      )}

      {data && data.length === 0 && (
        <div className="mt-8 rounded-xl border border-border bg-card p-10 text-center shadow-card">
          <p className="text-sm text-muted-foreground">
            You haven't placed any orders yet.
          </p>

          <Button asChild className="mt-4">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      )}

      {data && data.length > 0 && (
        <ul className="mt-8 space-y-4">
          {data.map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-border bg-card p-5 card-lift"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className="rounded-full"
                >
                  {statusLabels[order.status] ?? order.status}
                </Badge>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm">
                {order.items?.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-3"
                  >
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      {currency(
                        Number(item.unit_price) * item.quantity,
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">
                  {order.address}
                </span>

                <span className="font-semibold">
                  {currency(Number(order.total))}
                </span>
              </div>

              {order.prescription_path && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-rx">
                    <FileText className="size-3.5" />
                    Prescription attached
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={openingPrescription === order.id}
                    onClick={() =>
                      handleViewPrescription(order.id)
                    }
                  >
                    {openingPrescription === order.id ? (
                      <>
                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 size-3.5" />
                        View prescription
                      </>
                    )}
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}