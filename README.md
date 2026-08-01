# Kiosko-TP-FINAL



## Integrantes

- Dante luca ortega
- Tomas valentin muruchi
- Gay 1
- Gay 2

## IDEA INICIAL: 

Capacidad de guardar todo lo que tienes en tu tienda colocando le un nombre, una ID, el precio, quizás una imagen, donde cada vez que se logre vender o comprar, sumar o restar ese producto, o agregar algo nuevo.

Agregar la función de marcar si ese producto es algo limitado (por ende, si se acaba no te lo recuerda aparte de mencionar que se te agotó con una notificación), solo compra en días especiales (si son fechas navideñas, te recordará que debes comprar), o debe ser un producto normal (A partir de que la cantidad de ese producto es igual o inferior a lo que guardaste, se te avisará cuando debes comprar)

Una zona donde te dice el dinero hipotético que deberías tener (no es dinero de verdad), donde tu puedes subir y bajar lo cuando quieras en caso de algún cambio externo, o configurar que si se vende X productos, automáticamente tu dinero sube dependiendo de lo que cuesta, o que fue regalo y por ende no sube o baja tu dinero pero si se resta el producto.

Tener un historial que te diga todos los cambios que ocurren, ya sea de las compras, lo que se vendió, añadió, se quitó, etc.

Modificar el precio de los productos cuando quieras, agarrar varios productos que se vendieron pero añadir que ocurrió un descuento y por ende el precio que se vendió fue menor.

Guardar toda la información, o solo la del historial, los productos de hoy, lo que se vendió, regalo, etc. Dándote lo en un .txt que puedes descargar o similar.

Si aceptan, quizás puedo hablar con los del kiosco de al lado para que me digan que agregar y así sea más profesional y real.

## Estructura del proyecto

```
Kiosko-TP-FINAL/
├── Backend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── Frontend/
│   ├── index.html
│   ├── styles.css
│   ├── *.js
│   └── Dockerfile
├── db/
│   └── init.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

## Páginas del frontend (CSR contra el backend)

- **Productos**: listado con stock actual, alertas de reposición, alta/edición/baja.
- **Movimientos / Historial**: registrar ventas, compras, regalos y ajustes; ver el historial completo.
- **Proveedores**: alta/edición/baja de proveedores.

## Tecnologías

- **Frontend**: HTML, CSS y JavaScript plano (sin frameworks), consumiendo la API vía `fetch`.
- **Backend**: Node.js + Express, con `cors` y `dotenv`.
- **Base de datos**: PostgreSQL.
- **Contenedores**: Docker + Docker Compose (servicios separados para frontend, backend y base de datos).

## Cómo levantar el proyecto

### Con Docker Compose (recomendado)

1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` en la raíz del proyecto, y `Backend/.env.example` a `Backend/.env`, completando los valores (deben coincidir entre ambos archivos en `DB_USER`, `DB_PASSWORD` y `DB_NAME`).
3. Desde la raíz del proyecto, ejecutar:
   ```bash
   docker compose up --build
   ```
4. Acceder a:
   - Frontend: `http://localhost:8080`
   - Backend (API): `http://localhost:3000`

También se puede levantar cada servicio por separado, por ejemplo:
```bash
docker compose up backend
docker compose up frontend
```

### Sin Docker (desarrollo local)

**Backend:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

En este caso se necesita una instancia de PostgreSQL corriendo localmente, con las credenciales configuradas en `Backend/.env` (usando `DB_HOST=localhost`).

## Capturas de pantalla

_Pendiente: agregar capturas del sitio funcionando una vez completado el desarrollo del frontend y backend._

