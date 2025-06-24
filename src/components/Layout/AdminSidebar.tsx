// src/components/Layout/AdminSidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => (
  <nav className="space-y-2 p-4 bg-white dark:bg-gray-800 rounded shadow">
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        isActive ? 'block font-semibold text-amber-600' : 'block text-gray-700 dark:text-gray-200'
      }
    >
      Panel
    </NavLink>
    <NavLink
      to="/admin/products"
      className={({ isActive }) =>
        isActive ? 'block font-semibold text-amber-600' : 'block text-gray-700 dark:text-gray-200'
      }
    >
      Productos
    </NavLink>
    <NavLink
      to="/admin/manage-orders"
      className={({ isActive }) =>
        isActive ? 'block font-semibold text-amber-600' : 'block text-gray-700 dark:text-gray-200'
      }
    >
      Gestionar pedidos
    </NavLink>
    {/* …otros enlaces… */}
  </nav>
);

export default AdminSidebar;
