// src/components/Layout/AdminSidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => (
  <nav className="space-y-2 p-4 bg-white rounded shadow">
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        isActive ? 'block font-semibold text-amber-600' : 'block text-gray-700'
      }
    >
      Dashboard
    </NavLink>
    <NavLink
      to="/admin/products"
      className={({ isActive }) =>
        isActive ? 'block font-semibold text-amber-600' : 'block text-gray-700'
      }
    >
      Productos
    </NavLink>
    <NavLink
      to="/admin/orders"
      className={({ isActive }) =>
        isActive ? 'block font-semibold text-amber-600' : 'block text-gray-700'
      }
    >
      Pedidos
    </NavLink>
    {/* …otros enlaces… */}
  </nav>
);

export default AdminSidebar;
