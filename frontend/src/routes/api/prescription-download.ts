import { createFileRoute } from "@tanstack/react-router";
import { issueSignedToken, presignUrl } from "@vercel/blob";

export const Route = createFileRoute("/api/prescription-download")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authorization = request.headers.get("Authorization");

          if (!authorization) {
            return Response.json(
              { detail: "Authentication required" },
              { status: 401 },
            );
          }

          const body = await request.json();
          const orderId = body.orderId as string;

          if (!orderId) {
            return Response.json(
              { detail: "orderId is required" },
              { status: 400 },
            );
          }

          const apiUrl =
            import.meta.env["VITE_API_URL"] ??
            "http://127.0.0.1:8000";

          const apiKey = import.meta.env["VITE_API_KEY"];

          const ordersResponse = await fetch(
            `${apiUrl}/api/orders`,
            {
              method: "GET",
              headers: {
                Authorization: authorization,
                ...(apiKey
                  ? {
                      "X-API-Key": apiKey,
                    }
                  : {}),
              },
            },
          );

          if (!ordersResponse.ok) {
            return Response.json(
              { detail: "Unable to verify order ownership" },
              { status: ordersResponse.status },
            );
          }

          const orders = (await ordersResponse.json()) as Array<{
            id: string;
            prescription_path: string | null;
          }>;

          const order = orders.find(
            (item) => item.id === orderId,
          );

          if (!order) {
            return Response.json(
              { detail: "Order not found" },
              { status: 404 },
            );
          }

          if (!order.prescription_path) {
            return Response.json(
              { detail: "No prescription attached" },
              { status: 404 },
            );
          }

          if (
            !order.prescription_path.startsWith(
              "prescriptions/",
            )
          ) {
            return Response.json(
              { detail: "Unsupported prescription format" },
              { status: 400 },
            );
          }

          const token = await issueSignedToken({
            operations: ["get"],
          });

          const { presignedUrl } = await presignUrl(token, {
            pathname: order.prescription_path,
            operation: "get",
            access: "private",
            validUntil: Date.now() + 5 * 60 * 1000,
          });

          return Response.json({
            presignedUrl,
          });
        } catch (error) {
          console.error(
            "Prescription download URL error:",
            error,
          );

          return Response.json(
            {
              detail:
                "Unable to create prescription download URL",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});