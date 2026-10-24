<div align="center">
  <img src="https://img.shields.io/badge/Frontend-Vite%20+%20React%20+%20TypeScript-blue" />
  <img src="https://img.shields.io/badge/Framework-Modern%20Web%20App-lightgrey" />
</div>

# Eulalia Frontend – Digital Political Affiliation Platform

**STATUS**: ACTIVE (Under Development)

This is the web frontend of the **Eulalia** system, part of the self-sovereign identity and political traceability ecosystem. It allows citizens, political organizations, and electoral authorities to securely and transparently interact with the platform's modules.

---

## (EN) English Version

### Overview

Eulalia Frontend provides the web interface for the VoterID system. It connects to the backend API and enables:
- Citizen registration and authentication
- Political organization management
- Affiliation tracking and verification
- Real-time status dashboards

### Table of Contents
1. [Technologies](#technologies-en)
2. [Project Structure](#structure-en)
3. [Getting Started](#getting-started-en)
4. [Configuration](#configuration-en)
5. [Features](#features-en)
6. [API Integration](#api-integration-en)

<a name="technologies-en"></a>
### Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Vite** | Fast modern frontend bundler |
| **React** | UI Component library |
| **TypeScript** | Static typing |
| **Axios** | HTTP client |
| **TailwindCSS** | Utility-first CSS |
| **React Toastify** | Notifications |
| **Context API** | State management |
| **React Router** | Navigation |

<a name="structure-en"></a>
### Project Structure

```
eulalia-frontend/
├── public/
├── src/
│   ├── assets/           # Static assets
│   ├── components/        # Reusable UI components
│   ├── context/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

<a name="getting-started-en"></a>
### Getting Started

```bash
# Clone
git clone https://github.com/democracyonchain/eulalia-frontend.git
cd eulalia-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build
```

<a name="configuration-en"></a>
### Configuration

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5219
VITE_API_TIMEOUT=30000
```

<a name="features-en"></a>
### Features

- **Authentication**: JWT-based login system
- **Citizen Dashboard**: View registration status
- **Organization Management**: CRUD for political organizations
- **Affiliation Tracking**: View and manage affiliations
- **Real-time Status**: Consolidated registration status display
- **Responsive Design**: Works on desktop and mobile

<a name="api-integration-en"></a>
### API Integration

The frontend connects to the following backend endpoints:

| Service | Method | Endpoint |
| :--- | :--- | :--- |
| Auth | POST | `/api/Auth/login` |
| Users | GET/POST | `/api/Usuario` |
| SSI | GET/POST | `/api/SSI/*` |
| Biometrics | GET/POST | `/api/Biometria/*` |
| Affiliations | GET/POST | `/api/Afiliacion` |

---

## (ES) Versión en Español

### Descripción

Eulalia Frontend proporciona la interfaz web para el sistema VoterID. Se conecta a la API del backend y permite:
- Registro y autenticación de ciudadanos
- Gestión de organizaciones políticas
- Seguimiento y verificación de afiliaciones
- Paneles de estado en tiempo real

### Tabla de Contenidos
1. [Tecnologías](#tecnologias-es)
2. [Estructura del Proyecto](#estructura-es)
3. [Comenzando](#comenzar-es)
4. [Configuración](#configuracion-es)
5. [Funcionalidades](#funcionalidades-es)
6. [Integración API](#integracion-api-es)

<a name="tecnologias-es"></a>
### Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **Vite** | Empaquetador moderno rápido |
| **React** | Biblioteca de componentes UI |
| **TypeScript** | Tipado estático |
| **Axios** | Cliente HTTP |
| **TailwindCSS** | CSS utilitario |
| **React Toastify** | Notificaciones |
| **Context API** | Gestión de estado |
| **React Router** | Navegación |

<a name="estructura-es"></a>
### Estructura del Proyecto

```
eulalia-frontend/
├── public/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes reutilizables
│   ├── context/         # Contextos de React
│   ├── hooks/           # Hooks personalizados
│   ├── pages/          # Componentes de página
│   ├── services/       # Servicios de API
│   ├── types/         # Tipos TypeScript
│   ├── utils/         # Utilidades
│   ├── App.tsx        # Componente principal
│   └── main.tsx      # Punto de entrada
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

<a name="comenzar-es"></a>
### Comenzando

```bash
# Clonar
git clone https://github.com/democracyonchain/eulalia-frontend.git
cd eulalia-frontend

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

<a name="configuracion-es"></a>
### Configuración

Crear archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:5219
VITE_API_TIMEOUT=30000
```

<a name="funcionalidades-es"></a>
### Funcionalidades

- **Autenticación**: Sistema de login basado en JWT
- **Panel de Ciudadano**: Ver estado de registro
- **Gestión de Organizaciones**: CRUD para organizaciones políticas
- **Seguimiento de Afiliaciones**: Ver y gestionar afiliaciones
- **Estado en Tiempo Real**: Visualización consolidada del estado de registro
- **Diseño Responsivo**: Funciona en escritorio y móvil

<a name="integracion-api-es"></a>
### Integración de API

El frontend se conecta a los siguientes endpoints del backend:

| Servicio | Método | Endpoint |
| :--- | :--- | :--- |
| Auth | POST | `/api/Auth/login` |
| Usuarios | GET/POST | `/api/Usuario` |
| SSI | GET/POST | `/api/SSI/*` |
| Biométricos | GET/POST | `/api/Biometria/*` |
| Afiliaciones | GET/POST | `/api/Afiliacion` |

---

## Connections

- **Backend**: [eulalia-backend](https://github.com/democracyonchain/eulalia-backend)
- **Mobile App**: [eulalia-app](https://github.com/democracyonchain/eulalia-app)
- **Identus**: [eulalia-identus](https://github.com/democracyonchain/eulalia-identus)

---

## Prerequisites

For the frontend to work, ensure these services are running:

| Service | Port | Description |
| :--- | :--- | :--- |
| **Backend .NET** | 5219 | API REST |
| **PostgreSQL** | 5432 | Database |

---

## Author

**David Tacuri** – Project Lead
