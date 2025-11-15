# Keynua Contract Creator

## Instalación Local

### Opción 1: Con `start-dev.sh` (Desarrollo)

```bash
git clone <repo>
cd test-keynua
npm install -r backend frontend
./start-dev.sh
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

### Opción 2: Con Docker Compose

```bash
git clone <repo>
cd test-keynua
docker compose up --build
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

### Requisitos previos

- **Opción 1**: Node.js 18+
- **Opción 2**: Docker y Docker Compose

### Variables de entorno

Crear `.env` en la raíz del proyecto:

```
KEYNUA_API_KEY=tu_api_key
KEYNUA_API_TOKEN=tu_api_token
WEBHOOK_API_KEY=tu_webhook_key
```

Para la **Opción 1**, el script `start-dev.sh` genera automáticamente los archivos `.env` en backend y frontend.
