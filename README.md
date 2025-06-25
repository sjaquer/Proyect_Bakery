<p align="center">
  <img src="https://avatars.githubusercontent.com/u/72231436?v=4" alt="Avatar" width="120" style="border-radius: 50%;" />
</p>

# Digital Bakery (Frontend)

> **“La vitrina digital que impulsa tu negocio al siguiente nivel.”**

---

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.1.3-blue?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.1.0-yellow?logo=vite&logoColor=black" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.2-lightgray?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vercel-Edge%20Functions-black?logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

---

## 🧠 Descripción

Digital Bakery Frontend es una **SPA** moderna, escrita en **React** y **TypeScript**, que emplea **Vite** para la construcción y **Tailwind CSS** para la capa de estilos. Ofrece una vitrina digital adaptable a negocios con catálogo de productos —panaderías, cafeterías, floristerías, artesanías o servicios por suscripción— y prioriza la velocidad de carga y la experiencia de usuario.

---

## ✨ Características principales

- **Catálogo interactivo**: búsqueda, filtrado y paginación de artículos con rendimiento optimizado.
- **Flujo de compra completo**: carrito persistente, proceso de checkout y validación de datos.
- **Actualizaciones en tiempo real**: seguimiento de pedidos y notificaciones mediante SSE.
- **Componentes reutilizables**: estructura basada en hooks y contextos para fomentar la modularidad.
- **Optimización avanzada**: bundles livianos, carga diferida y compresión de imágenes a través de Google Image FX.

---

## 💡 Innovación y adaptabilidad

- **Modularidad total**  
  Componentes desacoplados pensados para integrarse en cualquier sector: comercios, servicios o suscripciones.

- **Costos operativos reducidos**  
  El despliegue en Vercel y el uso de librerías open source disminuyen hasta un **40 %** los gastos frente a plataformas tradicionales.

- **Escalabilidad y flexibilidad**  
  La organización de carpetas y la abstracción de hooks facilitan agregar nuevas funcionalidades sin reescribir código.

- **Enfoque UX/UI profesional**  
  Interfaces accesibles, responsive y optimizadas para las Core Web Vitals.

- **Preparado para IA futura**  
  Puntos de extensión disponibles para chatbots, motores de recomendación y dashboards de BI.

---

## 📋 Estructura del repositorio

```
frontend/
├── public/           # index.html, favicon y recursos estáticos
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Instalación y desarrollo local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/sjaquer/digital-bakery-frontend.git
   cd digital-bakery-frontend
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   Copia `.env.example` a `.env` y ajusta los valores según tu entorno.

4. **Ejecuta en modo desarrollo**
   ```bash
   npm run dev
   ```
   Visita `http://localhost:5173`

5. **Genera build de producción**
   ```bash
   npm run build
   ```

---

## 🚀 Despliegue

El proyecto está preparado para desplegarse en **Vercel**, sacando provecho de las Edge Functions y de la CDN global. Vincula tu repositorio y define la variable `VITE_API_BASE_URL` para apuntar a tu API.

---

## 🌐 Demo en vivo

🌟 [https://digitalbakery.vercel.app/](https://digitalbakery.vercel.app/)

---

## 🔮 Futuras integraciones (IA planeada)

> *Estas funcionalidades se incorporarán en futuras versiones tras validar el MVP.*

- Chatbot conversacional para soporte y gestión de pedidos.
- Sistema de recomendación de productos basado en comportamiento.
- Paneles de Business Intelligence para métricas e inventario.

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado por **[sjaquer](https://github.com/sjaquer)**

*La vitrina digital que tu negocio necesita.*
