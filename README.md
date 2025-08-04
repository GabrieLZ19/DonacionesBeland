# 🌱 Sistema de Donaciones Beland

Sistema completo de donaciones con integración a Payphone para la organización Beland de sostenibilidad ambiental. Incluye frontend responsivo con SweetAlert2 y backend modular con arquitectura escalable.

## 📁 Estructura del Proyecto

```
DonacionesBeland/
├── frontend/                 # Aplicación web frontend
│   ├── index.html           # Página principal responsiva
│   ├── css/                 # Estilos personalizados (si necesarios)
│   └── js/
│       └── donations.js     # Lógica de donaciones con SweetAlert2
├── backend/                 # API REST backend modular
│   ├── config/
│   │   └── index.js         # Configuración centralizada
│   ├── controllers/
│   │   ├── donationController.js # Lógica de donaciones
│   │   └── healthController.js   # Health checks
│   ├── middleware/
│   │   ├── errorHandler.js  # Manejo de errores
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── validation.js    # Validaciones
│   ├── routes/
│   │   ├── donations.js     # Rutas de donaciones
│   │   ├── health.js        # Rutas de estado
│   │   └── index.js         # Router principal
│   ├── services/
│   │   └── payphoneService.js # Integración con Payphone
│   ├── utils/
│   │   ├── helpers.js       # Funciones auxiliares
│   │   └── logger.js        # Sistema de logging
│   ├── .env                 # Variables de entorno (NO SUBIR)
│   ├── .env.example         # Ejemplo de variables
│   ├── package.json         # Dependencias
│   ├── server.js           # Punto de entrada
│   └── README.md           # Documentación del backend
├── .gitignore              # Archivos a ignorar en Git
└── README.md               # Este archivo
```

## 🚀 Configuración e Instalación

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPO]
cd "Donaciones Beland"
```

### 2. Configurar Backend

#### Instalar Dependencias

```bash
cd backend
npm install
```

#### Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` y agrega tus credenciales de Payphone:

```env
PAYPHONE_TOKEN=tu_token_real_aqui
PAYPHONE_STORE_ID=tu_store_id_real_aqui
```

#### Obtener Credenciales de Payphone

1. Regístrate en [Payphone](https://payphone.app)
2. Ve a tu panel de control
3. Obtén tu **Token** y **Store ID**
4. Agrégalos al archivo `.env`

### 3. Ejecutar la Aplicación

#### Iniciar Backend

```bash
cd backend
npm run dev
```

El backend correrá en: `http://localhost:3001`

#### Servir Frontend

Abre `frontend/index.html` en tu navegador o usa un servidor web simple:

```bash
cd frontend
python -m http.server 3000
# O con Node.js
npx serve .
```

El frontend correrá en: `http://localhost:3000`

## ✨ Características

### 🎨 Frontend

- ✅ **Diseño responsivo** con Tailwind CSS optimizado para móviles
- ✅ **Logo SVG personalizado** de Beland integrado
- ✅ **SweetAlert2** para alertas elegantes y profesionales
- ✅ **Navegación funcional** con smooth scroll a secciones
- ✅ **Formularios intuitivos** con validación en tiempo real
- ✅ **Compatibilidad móvil** completa con breakpoints responsivos

### 🚀 Backend

- ✅ **Arquitectura modular** separada por responsabilidades
- ✅ **Integración Payphone** segura con validaciones robustas
- ✅ **Rate limiting** y middleware de seguridad
- ✅ **Logging estructurado** para monitoreo y debugging
- ✅ **Health checks** para estado del sistema
- ✅ **Endpoints RESTful** con documentación integrada
- ✅ **Manejo de errores** centralizado y consistente

### �️ Seguridad

- ✅ **Variables de entorno** para datos sensibles
- ✅ **CORS configurado** con múltiples orígenes
- ✅ **Headers de seguridad** con Helmet
- ✅ **Validación robusta** en todos los endpoints
- ✅ **Rate limiting** por IP para prevenir spam
- ✅ **Gitignore** completo para proteger credenciales

## 📊 API Endpoints

### Estado del Sistema

- `GET /` - Información general de la API
- `GET /api/health` - Estado del servidor y métricas
- `GET /api/health/config` - Configuración del sistema

### Donaciones

- `POST /api/donations/create-transaction` - Crear nueva transacción
- `POST /api/donations/webhook` - Webhook para Payphone
- `POST /api/create-payphone-transaction` - Endpoint legacy (compatibilidad)

**Ejemplo de request:**

```json
{
  "amount": 25.0,
  "description": "Donación de $25 USD para Beland - Sostenibilidad Ambiental",
  "clientTxId": "B1234567890"
}
```

**Ejemplo de response:**

```json
{
  "success": true,
  "paymentUrl": "https://payp.page.link/xyz123",
  "transactionId": "B1234567890",
  "message": "Link de pago creado exitosamente"
}
```

## 🔄 Flujo de Donación

1. **Usuario selecciona cantidad** en el frontend
2. **Frontend envía request** al backend
3. **Backend crea transacción** con Payphone
4. **Usuario es redirigido** a página de pago
5. **Payphone procesa el pago**
6. **Usuario regresa** con resultado
7. **Frontend muestra confirmación**

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Backend
npm start          # Producción
npm run dev        # Desarrollo con nodemon

# Frontend
# Abrir directamente index.html o usar servidor web
```

### Variables de Entorno

| Variable            | Descripción                 | Ejemplo                      |
| ------------------- | --------------------------- | ---------------------------- |
| `PAYPHONE_TOKEN`    | Token de API de Payphone    | `eyJ0eXAiOiJKV1QiLCJhbGc...` |
| `PAYPHONE_STORE_ID` | ID de tu tienda en Payphone | `123456`                     |
| `PORT`              | Puerto del servidor backend | `3001`                       |
| `NODE_ENV`          | Ambiente de ejecución       | `development`                |
| `FRONTEND_URL`      | URL del frontend            | `http://localhost:3000`      |

## 🚨 Importante

- **NUNCA** subas el archivo `.env` a Git
- **SIEMPRE** usa HTTPS en producción
- **ACTUALIZA** las URLs en producción
- **MONITOREA** los logs del servidor

## 📝 TODO

- [ ] Agregar base de datos para historial de donaciones
- [ ] Implementar dashboard de administración
- [ ] Agregar notificaciones por email
- [ ] Implementar analytics detallados
- [ ] Agregar tests unitarios

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📧 Soporte

Para soporte técnico, contacta a: [gabriellazo48@gmail.com]

---

**© 2025 Beland - Sostenibilidad Ambiental**
