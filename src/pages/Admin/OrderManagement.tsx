// src/pages/Admin/OrderManagement.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/shared/Button";
import WhatsAppIcon from "../../components/shared/WhatsAppIcon";
import {
  formatPrice,
  formatDate,
  formatOrderStatus,
  getStatusColor,
} from "../../utils/formatters";
import type { Order } from "../../types/order";
import { ORDER_STATUSES } from "../../types/order";

const OrderManagement: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    orders,
    fetchOrders,
    updateOrderStatus,
    isLoading: loading,
    error,
  } = useOrderStore();
  const activeStatuses = ORDER_STATUSES.filter(
    (s) => s !== "cancelled" && s !== "rejected"
  );
  const columnColors: Record<string, string> = {
    pending: "bg-yellow-50",
    received: "bg-blue-50",
    preparing: "bg-orange-50",
    ready: "bg-green-50",
    delivered: "bg-gray-50",
  };

  useEffect(() => {
    // 1) Si no hay usuario, lo mandamos a login
    if (!user) {
      navigate("/login");
      return;
    }
    // 2) Si no es admin, al home
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    // 3) Ya está todo validado: cargamos pedidos
    fetchOrders();
  }, [user, navigate, fetchOrders]);

  useEffect(() => {
    const handler = () => fetchOrders();
    window.addEventListener("orders-updated", handler);
    return () => window.removeEventListener("orders-updated", handler);
  }, [fetchOrders]);

  const advanceStatus = async (orderId: string, current: string) => {
    const idx = activeStatuses.indexOf(current as Order["status"]);
    if (idx === -1 || idx === activeStatuses.length - 1) return;
    const next = activeStatuses[idx + 1];
    try {
      await updateOrderStatus(orderId, next as Order["status"]);
      await fetchOrders();
      window.dispatchEvent(new CustomEvent("orders-updated"));
    } catch (err: any) {
      console.error("Error updating status", err);
    }
  };

  const retreatStatus = async (orderId: string, current: string) => {
    const idx = activeStatuses.indexOf(current as Order["status"]);
    if (idx <= 0) return;
    const prev = activeStatuses[idx - 1];
    try {
      await updateOrderStatus(orderId, prev as Order["status"]);
      await fetchOrders();
      window.dispatchEvent(new CustomEvent("orders-updated"));
    } catch (err: any) {
      console.error("Error updating status", err);
    }
  };

  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const rejectedOrders = orders.filter((o) => o.status === "rejected");


  const rejectOrder = async (orderId: string) => {
    const reason = window.prompt("¿Rechazar este pedido? Indica la razón:");
    if (reason === null) return;
    try {
      await updateOrderStatus(orderId, "rejected", reason);
      await fetchOrders();
      window.dispatchEvent(new CustomEvent("orders-updated"));
    } catch (err: any) {
      console.error("Error rejecting order", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Gestión de Pedidos
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">
              Error loading orders: {error}
            </p>
          </div>
        )}

        {loading ? (
          <p>Cargando pedidos…</p>
          ) : (
          <div className="flex flex-col gap-6 md:flex-row md:overflow-x-auto pb-4">
            {activeStatuses.map((st) => (
              <div
                key={st}
                className={`rounded-lg p-4 shadow w-full md:min-w-[16rem] ${columnColors[st]}`}
              >
                <h3 className="text-sm font-semibold text-center mb-2">
                  {formatOrderStatus(st)}
                </h3>
                <div className="space-y-2">
                  {orders
                    .filter((o) => o.status === st)
                    .map((o) => (
                      <div
                        key={o.id}
                        className="bg-gray-50 rounded p-3 shadow border space-y-2"
                      >
                        <div className="text-sm font-medium">
                          #{String(o.id).slice(-8)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(o.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.customer?.name || o.customer?.id || "—"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{o.customer?.phone || "—"}</span>
                          <a
                            href={`https://wa.me/${o.customer?.phone || ""}`}
                            target="_blank"
                            rel="noopener"
                            aria-label="Message customer on WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4 text-green-600" />
                          </a>
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.customer?.email || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {o.customer?.address || "—"}
                        </div>
                        {o.paymentMethod && (
                          <div className="text-xs text-gray-500">
                            Pago: {o.paymentMethod}
                            {o.paymentMethod === "cash" && o.cashAmount
                              ? ` (S/ ${o.cashAmount})`
                              : ""}
                          </div>
                        )}
                        <ul className="text-xs text-gray-700 list-disc pl-4">
                          {o.items?.map((item) => (
                            <li key={item.id}>
                              {item.Product?.name || "—"} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                        <div className="text-sm font-semibold">
                          {formatPrice(o.total)}
                        </div>
                        {o.status === "rejected" && o.reason && (
                          <div className="text-xs text-red-600">
                            Motivo: {o.reason}
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStatusColor(o.status)}`}
                          >
                            {formatOrderStatus(o.status)}
                          </span>
                          <div className="flex gap-2 flex-wrap justify-center">
                            {o.status === "pending" && (
                              <Button
                                size="xs"
                                variant="danger"
                                onClick={() => rejectOrder(o.id)}
                              >
                                Rechazar
                              </Button>
                            )}
                            <Button
                              size="xs"
                              onClick={() =>
                                retreatStatus(o.id, o.status)
                              }
                              disabled={
                                o.status === "pending" ||
                                o.status === "cancelled" ||
                                o.status === "rejected"
                              }
                            >
                              Retroceder
                            </Button>
                            <Button
                              size="xs"
                              onClick={() => advanceStatus(o.id, o.status)}
                              disabled={
                                o.status === "delivered" ||
                                o.status === "cancelled" ||
                                o.status === "rejected"
                              }
                            >
                              Avanzar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {(cancelledOrders.length > 0 || rejectedOrders.length > 0) && (
          <div className="mt-8">
            {cancelledOrders.length > 0 && (
              <>
                <h2 className="text-sm font-semibold mb-2">Cancelados</h2>
                <ul className="text-sm space-y-1 mb-4">
                  {cancelledOrders.map((o) => (
                    <li key={o.id} className="border rounded p-2 bg-gray-50">
                      #{String(o.id).slice(-8)} - {o.customer?.name || "—"}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {rejectedOrders.length > 0 && (
              <>
                <h2 className="text-sm font-semibold mb-2">Rechazados</h2>
                <ul className="text-sm space-y-1">
                  {rejectedOrders.map((o) => (
                    <li key={o.id} className="border rounded p-2 bg-gray-50">
                      #{String(o.id).slice(-8)} - {o.customer?.name || "—"}
                      {o.reason && (
                        <span className="ml-2 text-red-600">({o.reason})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
