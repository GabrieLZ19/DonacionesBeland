# Backend de Donaciones Beland

API REST para el sistema de donaciones de Beland, con integración a Payphone para procesamiento de pagos.

## 🏗️ Arquitectura

```
backend/
├── config/
│   └── index.js              # Configuración centralizada
├── controllers/
│   ├── donationController.js # Lógica de donaciones
│   └── healthController.js   # Health checks y estado del sistema
├── middleware/
│   ├── errorHandler.js       # Manejo de errores
│   ├── rateLimiter.js        # Rate limiting
│   └── validation.js         # Validaciones
├── routes/
│   ├── donations.js          # Rutas de donaciones
│   ├── health.js             # Rutas de estado
│   └── index.js              # Router principal
├── services/
│   └── payphoneService.js    # Integración con Payphone
├── utils/
│   ├── helpers.js            # Funciones auxiliares
│   └── logger.js             # Sistema de logging
├── .env                      # Variables de entorno
├── package.json              # Dependencias
└── server.js                 # Punto de entrada
```

## 🚀 Características

### Seguridad

- ✅ Rate limiting por IP
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Validación de datos de entrada
- ✅ Manejo seguro de variables de entorno

### Monitoreo

- ✅ Logging estructurado
- ✅ Health checks
- ✅ Métricas de sistema
- ✅ Manejo de errores centralizado

### API

- ✅ REST endpoints bien definidos
- ✅ Validación de entrada
- ✅ Respuestas consistentes
- ✅ Documentación integrada

## 📡 Endpoints

### Información General

```
GET / - Información de la API
```

### Estado del Sistema

```
GET /api/health - Estado del servidor
GET /api/health/config - Configuración del sistema
```

### Donaciones

```
POST /api/donations/create-transaction - Crear transacción de donación
POST /api/donations/webhook - Webhook de Payphone
```

### Compatibilidad

```
POST /api/create-payphone-transaction - Endpoint legacy para compatibilidad
```

## 🔧 Configuración

### Variables de Entorno

```env
# Servidor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Payphone
PAYPHONE_TOKEN=tu_token_aqui
PAYPHONE_STORE_ID=tu_store_id_aqui
```

### Instalación

```bash
npm install
npm start
```

### Desarrollo

```bash
npm run dev  # Con nodemon para auto-reload
```

## 📊 Logging

El sistema incluye logging estructurado con diferentes niveles:

- **INFO**: Información general
- **ERROR**: Errores del sistema
- **WARN**: Advertencias
- **DEBUG**: Información de desarrollo
- **DONATION**: Eventos específicos de donaciones

## 🛡️ Rate Limiting

- **Donaciones**: 10 requests por 15 minutos (producción)
- **Webhooks**: 30 requests por minuto
- **Development**: Límites más permisivos

## 🔍 Monitoreo

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Configuración del Sistema

```bash
curl http://localhost:3001/api/health/config
```

## 📝 Logs de Ejemplo

### Desarrollo

```
ℹ️  Servidor backend corriendo en puerto 3001
💰 DONATION: create_transaction { amount: 50, clientTxId: "B1234567890" }
```

### Producción

```json
{
  "level": "DONATION",
  "action": "create_transaction",
  "timestamp": "2025-08-04T10:30:00.000Z",
  "data": { "amount": 50, "clientTxId": "B1234567890" }
}
```

## 🚦 Estados de Respuesta

### Éxito (200)

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Error de Cliente (400)

```json
{
  "success": false,
  "message": "Error de validación",
  "details": ["Campo requerido: amount"]
}
```

### Error del Servidor (500)

```json
{
  "success": false,
  "message": "Error interno del servidor",
  "timestamp": "2025-08-04T10:30:00.000Z"
}
```

## 🔄 Migración desde Versión Anterior

La nueva estructura mantiene compatibilidad completa con el frontend existente mediante:

1. **Endpoint legacy**: `/api/create-payphone-transaction` redirige automáticamente
2. **Misma estructura de respuesta**: No se requieren cambios en el frontend
3. **Configuración idéntica**: Las mismas variables de entorno

## 🏃‍♂️ Próximos Pasos

- [ ] Implementar base de datos para auditoría
- [ ] Agregar autenticación para endpoints administrativos
- [ ] Implementar métricas de Prometheus
- [ ] Agregar tests unitarios e integración
- [ ] Configurar CI/CD pipeline
