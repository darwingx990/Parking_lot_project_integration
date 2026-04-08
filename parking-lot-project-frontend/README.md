# BioParking - Frontend

Frontend del sistema de parqueadero construido con HTML, CSS y JavaScript vanilla.

## Requisitos

- Node.js (para el backend)
- Navegador web moderno

## Instalación y Uso

### 1. Backend (parking-lot-project-backend)

```bash
cd ../parking-lot-project-backend
npm install
npm start
```

El backend se ejecutará en `http://localhost:3000`

### 2. Frontend

No requiere instalación. Simplemente abre `index.html` en tu navegador.

Para desarrollo, puedes usar un servidor local:
```bash
npx serve .
```

## Estructura del Proyecto

```
parking-lot-project-frontend/
├── assets/
│   └── images/          # Imágenes y logos
├── js/
│   ├── api.js           # API client para conexión con backend
│   └── load-header.js   # Carga el header compartido
├── styles/
│   └── styles.css       # Estilos globales
├── header.html          # Header compartido
├── index.html           # Disponibilidad de celdas
├── login.html           # Login administrador
├── usuario.html         # Login usuario
├── olvidaste_contraseña.html
├── registro-accesos.html  # Control de entradas/salidas
├── registro-usuarios.html # Gestión de usuarios
├── registroVehiculos.html # Gestión de vehículos y pico-placa
├── incidencias.html     # Reporte de incidencias
└── informes.html        # Reportes y estadísticas
```

## Páginas y Funcionalidades

### Página Principal (index.html)
- Visualización del estado de celdas (disponible/ocupada)
- Actualización automática cada 30 segundos

### Autenticación
- **login.html**: Login para administradores/operadores
- **usuario.html**: Login para usuarios regulares

### Gestión (requiere autenticación)

| Página | Funcionalidades |
|--------|-----------------|
| Registro de Accesos | Registrar entrada/salida, historial |
| Gestión de Usuarios | Crear usuarios, asignar vehículos, cambiar estado |
| Gestión de Vehículos | Registrar vehículos, actualizar, pico y placa |
| Incidencias | Reportar incidentes |
| Informes | Reportes y estadísticas |

## API Endpoints Utilizados

| Recurso | Métodos |
|---------|---------|
| `/api/usuarios` | GET, POST, PUT, DELETE |
| `/api/vehiculo` | GET, POST, PUT, DELETE |
| `/api/acceso-salida` | GET, POST, PUT, DELETE |
| `/api/get-estado` | GET, POST, PUT, PATCH |
| `/api/incidencia` | GET, POST, PUT, DELETE |
| `/api/reportes-incidencia` | GET, POST, PUT, DELETE |
| `/api/pico-placa` | GET, POST, PUT, DELETE |
| `/api/administradores` | GET, POST, PUT, DELETE |
| `/api/operadores` | GET, POST, PUT, DELETE |

## Paleta de Colores

```css
--morado: #6D28D9        /* Color principal */
--morado-hover: #5B21B6  /* Hover state */
--lavanda: #EDE9FE        /* Fondos claros */
--fondo: #F8FAFC          /* Fondo página */
--exito: #059669          /* Confirmaciones */
--error: #DC2626          /* Errores */
--alerta: #D97706         /* Advertencias */
```

## Notas de Desarrollo

- El frontend usa autenticación basada en localStorage
- El header `rol` se envía con cada petición al backend
- No se requiere JWT - la seguridad se maneja en el backend

## Solución de Problemas

### CORS Errors
Si ves errores de CORS, asegúrate de que el backend tenga CORS configurado:
```javascript
app.use(cors());
```

### Error de conexión
Si el frontend no puede conectar con el backend, verifica:
1. El backend está corriendo en puerto 3000
2. La URL en `js/api.js` es correcta (`http://localhost:3000/api`)
