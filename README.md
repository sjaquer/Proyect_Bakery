# Digital Bakery

Aplicación web de comercio electrónico para una panadería. Permite a los usuarios navegar por productos de panadería, gestionarlos en un carrito y realizar pedidos. Incluye un área administrativa para crear y editar productos, así como gestionar órdenes.

## Características

- Front‑end construido con **React**, **TypeScript** y **Vite**
- Estilos con **Tailwind CSS**
- Gestión de estado con **Zustand**
- Autenticación de usuarios y roles (cliente y administrador)
- Administración de productos y órdenes
- Integración con servicios REST a través de `axios`

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

1. Clona este repositorio
2. Ejecuta `npm install` para instalar las dependencias

```bash
npm install
```

## Uso en desarrollo

Inicia el servidor de desarrollo con:

```bash
npm run dev
```

Abre <http://localhost:5173> en tu navegador para ver la aplicación.

## Construcción para producción

Genera los archivos optimizados con:

```bash
npm run build
```

Luego puedes previsualizar el resultado con:

```bash
npm run preview
```

## Despliegue

El proyecto incluye configuración para **Vercel** en `vercel.json`. Al desplegar en Vercel se reescriben todas las rutas a `index.html` para admitir el enrutamiento del cliente.

---

¡Disfruta horneando código!
