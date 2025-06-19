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

  const customerRaw =
    apiOrder.customer ??
    apiOrder.Customer ??
    apiOrder.User ??
    apiOrder.customerInfo ??
    apiOrder.CustomerInfo ??
    null;

  let customer = customerRaw
    ? {
        ...customerRaw,
        name:
          customerRaw.name ??
          customerRaw.Name ??
          customerRaw.fullName ??
          customerRaw.full_name ??
          '',
        email: customerRaw.email ?? customerRaw.Email ?? '',
        phone:
          customerRaw.phone ??
          customerRaw.Phone ??
          customerRaw.phoneNumber ??
          customerRaw.phone_number ??
          '',
        address:
          customerRaw.address ??
          customerRaw.Address ??
          customerRaw.addressLine ??
          customerRaw.address_line ??
          '',
        role: customerRaw.role ?? customerRaw.Role,
        createdAt: customerRaw.createdAt ?? customerRaw.created_at,
        updatedAt: customerRaw.updatedAt ?? customerRaw.updated_at,
      }
    : ({} as any);

  // If some fields are missing, try root-level aliases
  customer = {
    ...customer,
    name:
      customer.name ??
      apiOrder.name ??
      apiOrder.Name ??
      apiOrder.fullName ??
      apiOrder.full_name ??
      '',
    email: customer.email ?? apiOrder.email ?? apiOrder.Email ?? '',
    phone:
      customer.phone ??
      apiOrder.phone ??
      apiOrder.Phone ??
      apiOrder.phoneNumber ??
      apiOrder.phone_number ??
      '',
    address:
      customer.address ??
      apiOrder.address ??
      apiOrder.Address ??
      apiOrder.addressLine ??
      apiOrder.address_line ??
      '',
  };

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
