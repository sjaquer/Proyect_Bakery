<p align="center">
  <img src="https://avatars.githubusercontent.com/u/72231436?v=4" alt="Avatar" width="120" style="border-radius: 50%;" />
</p>

# Digital Bakery (Frontend)

> **“La vitrina digital que impulsa tu negocio al siguiente nivel.”**

---

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.1.3-blue?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.1.0-yellow?logo=vite&logoColor=black" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.2-lightgray?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vercel-Edge%20Functions-black?logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

---

## 🧠 Descripción

Digital Bakery Frontend es una aplicación web **responsiva**, **ligera** y **modular** construida con React, TypeScript, Vite y Tailwind CSS. Proporciona una vitrina digital adaptable a cualquier negocio con catálogo de productos (panaderías, cafeterías, floristerías, artesanías, suscripciones, etc.), optimizando costes y garantizando una experiencia de usuario fluida.

---

## ✨ Características principales

- **Catálogo interactivo**: búsqueda, filtrado y paginación de productos.
- **Flujo de compra completo**: carrito, checkout y validación de datos.
- **Actualizaciones en tiempo real**: pedidos y notificaciones vía SSE.
- **Componentes reutilizables**: arquitectura basada en hooks y contextos.
- **Optimización**: bundles ligeros, carga diferida y compresión de imágenes con Google Image FX.

---

## 💡 Innovación y adaptabilidad

- **Modularidad total**  
  Componentes desacoplados listos para integrarse en cualquier sector: panaderías, tiendas, servicios de suscripción, etc.

- **Costos operativos reducidos**  
  Despliegue en Vercel y librerías open‑source ofrecen gastos hasta un **40 % menores** que soluciones tradicionales.

- **Escalabilidad y flexibilidad**  
  Estructura de carpetas y hooks facilita expansión de funcionalidades sin reescribir código.

- **Enfoque UX/UI profesional**  
  Diseño accesible, responsive y optimizado para Core Web Vitals.

- **Preparado para IA futura**  
  Puntos de extensión en la interfaz para chatbots, recomendadores y paneles de BI en próximas versiones.

---

## 📋 Estructura del repositorio

```
frontend/
├── public/                
│   └── index.html, favicon, assets estáticos
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
├── tailwind.config.ts     
├── tsconfig.json          
├── package.json           
└── README.md              
```

---

## ⚙️ Instalación y desarrollo local

1. Clona el repositorio  
   ```bash
   git clone https://github.com/sjaquer/digital-bakery-frontend.git
   cd digital-bakery-frontend
   ```

2. Instala dependencias  
   ```bash
   npm install
   ```

3. Configura variables de entorno  
   - Copia `.env.example` a `.env` y ajusta según tu entorno.

4. Ejecuta en modo desarrollo  
   ```bash
   npm run dev
   ```
   Accede en `http://localhost:5173`

5. Genera build de producción  
   ```bash
   npm run build
   ```

---

## 🚀 Despliegue

El frontend está optimizado para deploy en **Vercel**, aprovechando Edge Functions y CDN global. Solo necesitas vincular tu repositorio y configurar la variable de entorno `VITE_API_BASE_URL`.

---

## 🌐 Demo en vivo

🌟 [https://digitalbakery.vercel.app/](https://digitalbakery.vercel.app/)

---

## 🔮 Futuras integraciones (IA planeada)

> *Estas características se implementarán en versiones posteriores tras validar el MVP.*

- Chatbot conversacional para atención y gestión de pedidos.  
- Recomendador de productos basado en comportamiento.  
- Dashboards de BI para métricas e inventario.

---

## 📜 Licencia

MIT License.

---

## 👨‍💻 Autor

Desarrollado por **[sjaquer](https://github.com/sjaquer)**

*La vitrina digital que tu negocio necesita.*
