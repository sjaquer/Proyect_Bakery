# Digital Bakery Frontend

This is the frontend of the Digital Bakery app.

## Development

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` to point to the backend API.

## Backend requirements

Orders require a `paymentMethod` column in the `orders` table. If your database was created before this column existed, run the appropriate migration or manually add:

```sql
ALTER TABLE orders ADD COLUMN "paymentMethod" VARCHAR(20);
```

Otherwise order creation will fail with `column "paymentMethod" of relation "orders" does not exist`.
