import { Order } from '../types/order';

// Normalize order objects returned by the API so our components can
// reliably access `items` and `customer` fields regardless of the
// backend naming convention.
export function mapApiOrder(apiOrder: any): Order {
  const items =
    apiOrder.items ??
    apiOrder.orderItems ??
    apiOrder.OrderItems ??
    apiOrder.Orderitems ??
    [];

  const mappedItems = items.map((it: any) => ({
    ...it,
    Product: {
      ...it.Product,
      imageUrl: it.Product?.imageUrl ?? it.Product?.image_url ?? '',
    },
  }));

  const customer =
    apiOrder.customer ??
    apiOrder.Customer ??
    apiOrder.User ??
    apiOrder.customerInfo ??
    apiOrder.CustomerInfo ??
    null;

  const createdAt = apiOrder.createdAt ?? apiOrder.created_at ?? '';

  return {
    ...apiOrder,
    items: mappedItems,
    customer,
    createdAt,
    total:
      apiOrder.total ?? apiOrder.total_amount ?? apiOrder.totalAmount ?? 0,
    paymentMethod:
      apiOrder.paymentMethod ?? apiOrder.payment_method ?? undefined,
    cashAmount: apiOrder.cashAmount ?? apiOrder.cash_amount ?? undefined,
    reason: apiOrder.reason ?? apiOrder.rejectionReason ?? apiOrder.rejection_reason ?? undefined,
  } as Order;
}
