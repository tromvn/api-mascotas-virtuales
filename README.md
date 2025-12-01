# API Mascotas - Full Stack MERN

Proyecto full stack de gestión de mascotas construido con MongoDB, Express, React y Node.js (stack MERN). Incluye una API RESTful para operaciones CRUD y una interfaz web sencilla.

## 📋 Características

- **Backend**: API REST con Express y Node.js
- **Base de datos**: MongoDB con Mongoose
- **Frontend**: Interfaz React con Vite
- **CORS** habilitado para comunicación frontend-backend
- **Logging** con Morgan
- **Hot reload** con Nodemon (desarrollo)

## 🚀 Tecnologías

### Backend
- Node.js
- Express v5.1.0
- Mongoose v8.19.1
- Morgan v1.10.1
- CORS v2.8.5

### Frontend
- React v19.1.1
- Vite v7.1.7
- ESLint

## 📦 Instalación Local

### Prerrequisitos

- Node.js >= 18.x
- MongoDB >= 6.x
- Git

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd api-mascotas
```

### 2. Configurar el Backend

```bash
# Instalar dependencias del backend
npm install

# Iniciar MongoDB (si no está corriendo)
sudo systemctl start mongod

# Verificar que MongoDB esté corriendo
sudo systemctl status mongod
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

### 4. Ejecutar en modo desarrollo

**Terminal 1 - Backend:**
```bash
# Desde la raíz del proyecto
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

La interfaz estará disponible en `http://localhost:5173`

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/pets` | Listar todas las mascotas |
| GET | `/pets/id/:id` | Obtener mascota por ID |
| GET | `/pets/name/:name` | Obtener mascota por nombre |
| POST | `/pets` | Crear mascota(s) |
| PUT | `/pets/id/:id` | Actualizar mascota por ID |
| PUT | `/pets/name/:name` | Actualizar mascota por nombre |
| DELETE | `/pets/id/:id` | Eliminar mascota por ID |
| DELETE | `/pets/name/:name` | Eliminar mascota por nombre |

### Ejemplo de petición POST

```json
{
  "name": "Winona",
  "animo": "feliz",
  "dueño": "Juan"
}
```

Para crear múltiples mascotas, envía un array:

```json
[
  {
    "name": "Winona",
    "animo": "feliz",
    "dueño": "Juan"
  },
  {
    "name": "Max",
    "animo": "juguetón",
    "dueño": "María"
  }
]
```

## 🖥️ Despliegue en Servidor Linux (Debian)

### Opción 1: Despliegue con Nginx

#### 1. Preparar el servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2
```

#### 2. Configurar el proyecto

```bash
# Clonar proyecto en /var/www
sudo mkdir -p /var/www
cd /var/www
sudo git clone <url-del-repositorio> api-mascotas
cd api-mascotas

# Instalar dependencias backend
sudo npm install --production

# Compilar frontend
cd frontend
sudo npm install
sudo npm run build
```

#### 3. Configurar PM2

```bash
# Desde /var/www/api-mascotas
pm2 start index.js --name "api-mascotas"
pm2 startup
pm2 save
```

#### 4. Configurar Nginx

Crea el archivo de configuración:

```bash
sudo nano /etc/nginx/sites-available/api-mascotas
```

Añade esta configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # O tu IP o dominio de Cloudflare Tunnel

    # Servir frontend
    location / {
        root /var/www/api-mascotas/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API
    location /pets {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activa el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/api-mascotas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Configurar Firewall (Opcional si usas Cloudflare Tunnel)

```bash
# Si NO usas Cloudflare Tunnel:
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw enable

# Si usas Cloudflare Tunnel, solo SSH es necesario:
sudo ufw allow 22
sudo ufw enable
```

### Opción 2: Despliegue en Oracle Cloud (Capa Gratuita)

#### 1. Crear instancia

1. Accede a Oracle Cloud Console
2. Crea una instancia VM.Standard.E2.1.Micro (siempre gratuita)
3. Selecciona imagen: Canonical Ubuntu 22.04
4. Descarga la clave SSH

#### 2. Conectar y configurar

```bash
# Conectar por SSH
ssh -i /ruta/a/tu-clave.pem ubuntu@<IP-PUBLICA>

# Seguir los pasos de "Opción 1: Despliegue con Nginx"
```

#### 3. Configurar reglas de ingreso

**Si NO usas Cloudflare Tunnel:**

En Oracle Cloud Console:
- Ve a Networking → Virtual Cloud Networks
- Selecciona tu VCN → Security Lists
- Añade regla de ingreso:
  - Source CIDR: 0.0.0.0/0
  - Destination Port: 80, 443

**Si usas Cloudflare Tunnel:**

Solo necesitas permitir SSH (puerto 22). No es necesario abrir los puertos 80 y 443.

#### 4. Configurar firewall de la instancia

**Si NO usas Cloudflare Tunnel:**

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

**Si usas Cloudflare Tunnel:**

No es necesario configurar reglas adicionales de iptables.

### Opción 3: Exponer con Cloudflare Tunnel

Cloudflare Tunnel permite exponer tu aplicación a internet sin abrir puertos en tu firewall ni necesitar una IP pública estática. Ideal para desarrollo y servidores detrás de NAT.

#### Ventajas de Cloudflare Tunnel

- ✅ No necesitas abrir puertos en el firewall
- ✅ Protección DDoS automática de Cloudflare
- ✅ HTTPS gratuito con certificados automáticos
- ✅ Funciona detrás de NAT/routers
- ✅ Sin necesidad de IP pública estática

#### 1. Prerrequisitos

- Cuenta de Cloudflare (gratuita)
- Dominio configurado en Cloudflare

#### 2. Instalar cloudflared

```bash
# Descargar e instalar cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Verificar instalación
cloudflared --version
```

#### 3. Autenticar con Cloudflare

```bash
cloudflared tunnel login
```

Esto abrirá un navegador para autorizar. Si estás en un servidor sin interfaz gráfica, copia la URL mostrada y ábrela en tu navegador local.

#### 4. Crear el tunnel

```bash
# Crear tunnel
cloudflared tunnel create api-mascotas

# Esto generará un archivo JSON con las credenciales
# Anota el UUID del tunnel que aparece
```

#### 5. Configurar el tunnel

Crea el archivo de configuración:

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Añade esta configuración:

```yaml
tunnel: <TUNNEL-UUID>
credentials-file: /root/.cloudflared/<TUNNEL-UUID>.json

ingress:
  # Ruta para la API
  - hostname: api.tu-dominio.com
    service: http://localhost:3000
  
  # Ruta para el frontend
  - hostname: tu-dominio.com
    service: http://localhost:80
  
  # Ruta de fallback (obligatoria)
  - service: http_status:404
```

**Alternativa con un solo dominio:**

```yaml
tunnel: <TUNNEL-UUID>
credentials-file: /root/.cloudflared/<TUNNEL-UUID>.json

ingress:
  - hostname: tu-dominio.com
    service: http://localhost:80
  
  - service: http_status:404
```

#### 6. Configurar DNS en Cloudflare

```bash
# Para configuración con subdominio API:
cloudflared tunnel route dns api-mascotas api.tu-dominio.com
cloudflared tunnel route dns api-mascotas tu-dominio.com

# O solo el dominio principal si usas un solo hostname:
cloudflared tunnel route dns api-mascotas tu-dominio.com
```

#### 7. Instalar como servicio

```bash
# Instalar el servicio
sudo cloudflared service install

# Iniciar el servicio
sudo systemctl start cloudflared

# Habilitar inicio automático
sudo systemctl enable cloudflared

# Verificar estado
sudo systemctl status cloudflared
```

#### 8. Verificar funcionamiento

```bash
# Ver logs del tunnel
sudo journalctl -u cloudflared -f

# Listar tunnels activos
cloudflared tunnel list

# Ver información del tunnel
cloudflared tunnel info api-mascotas
```

#### 9. Modificar configuración de Nginx (opcional)

Si usas Cloudflare Tunnel, actualiza tu configuración de Nginx para confiar en las IPs de Cloudflare:

```bash
sudo nano /etc/nginx/sites-available/api-mascotas
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com api.tu-dominio.com;

    # Confiar en IPs de Cloudflare
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2a06:98c0::/29;
    set_real_ip_from 2c0f:f248::/32;
    
    real_ip_header CF-Connecting-IP;

    # Servir frontend
    location / {
        root /var/www/api-mascotas/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API
    location /pets {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-For $http_cf_connecting_ip;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### 10. Gestión del tunnel

```bash
# Detener tunnel
sudo systemctl stop cloudflared

# Reiniciar tunnel
sudo systemctl restart cloudflared

# Ver logs en tiempo real
sudo journalctl -u cloudflared -f

# Eliminar tunnel (si es necesario)
cloudflared tunnel delete api-mascotas
```

#### Solución de problemas comunes

**Error: Tunnel no conecta**
```bash
# Verificar que el servicio esté corriendo
sudo systemctl status cloudflared

# Revisar logs
sudo journalctl -u cloudflared -n 50
```

**Error: 502 Bad Gateway**
- Verifica que Nginx esté corriendo: `sudo systemctl status nginx`
- Verifica que el backend esté corriendo: `pm2 status`
- Revisa los puertos en la configuración del tunnel

**Error: DNS no resuelve**
```bash
# Verificar rutas DNS
cloudflared tunnel route dns list

# Si es necesario, volver a crear la ruta
cloudflared tunnel route dns api-mascotas tu-dominio.com
```

## 🐳 Despliegue con Docker

> ⚠️ **Próximamente**: Los archivos Dockerfile y la configuración de Docker Compose serán añadidos en la próxima actualización del proyecto.

## 📁 Estructura del Proyecto

```
api-mascotas/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── app/
│   │   └── app.js        # Configuración Express
│   ├── controllers/
│   │   └── petController.js
│   ├── database/
│   │   └── connection.js  # Conexión MongoDB
│   ├── models/
│   │   └── Pet.js         # Modelo Mongoose
│   └── routes/
│       └── router.js      # Rutas API
├── index.js               # Punto de entrada
└── package.json
```

## 🛠️ Scripts Disponibles

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

### Frontend
```bash
npm run dev        # Servidor desarrollo
npm run build      # Compilar para producción
npm run preview    # Previsualizar build
npm run lint       # Ejecutar ESLint
```

## 📝 Estado del Proyecto

🚧 **En desarrollo** - Funcionalidades pendientes:

- [ ] Dockerfiles para backend y frontend
- [ ] Variables de entorno
- [ ] Autenticación y autorización
- [ ] Validación de datos
- [ ] Tests unitarios e integración
- [ ] Documentación API con Swagger
- [ ] Paginación en listado
- [ ] Filtros avanzados
- [ ] Subida de imágenes

## 👤 Tomás Bazán Luengo | tromvn

Proyecto educativo para aprendizaje de desarrollo full stack.

---

**Nota**: Este es un proyecto de aprendizaje. Para uso en producción, implementa validaciones, autenticación, manejo de errores robusto y prácticas de seguridad adicionales.
