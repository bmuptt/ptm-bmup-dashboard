# Docker Configuration

This directory contains the Docker configuration for the PTM BMUP Dashboard application.

## Architecture

The application uses a multi-stage build approach:
1. **Vue Builder Stage**: Builds the Vue.js application with environment variables
2. **Nginx Stage**: Serves the built application (static files)

## File Structure

```
docker/
├── nginx/
│   ├── Dockerfile      # Nginx container configuration
│   ├── default.conf    # Nginx server configuration
│   └── nginx.conf      # Nginx main configuration
├── vue/
│   └── Dockerfile      # Vue.js build configuration
└── README.md           # This file
```

## Environment Variables

### Build-time Environment Variables

Environment variables are injected during the build process:

1. **Docker Compose**: Passes environment variables to build args
2. **Vue Builder**: Builds application with environment variables
3. **Nginx**: Serves static files (no runtime substitution needed)

### Environment Variable Flow

```
Linux Environment → Docker Compose → Build Args → Vue Build → Static Files → Nginx
```

### Required Environment Variables

- `VITE_APP_BACKEND_URL`: Backend API URL
- `VITE_APP_BACKEND_URL_MASTER`: Master API URL

## Configuration Files

### `docker-compose.yml`
- Defines two services: Vue builder and Nginx server
- Passes environment variables as build args
- Maps port 3100 to container port 80

### `docker/nginx/Dockerfile`
- Uses Alpine Linux for smaller image size
- Serves static files from Vue build
- No runtime environment substitution needed

### `docker/vue/Dockerfile`
- Builds Vue.js application with environment variables
- Uses build args to inject environment variables

## Usage

### Development
```bash
# Set environment variables
export VITE_APP_BACKEND_URL=http://localhost:3000
export VITE_APP_BACKEND_URL_MASTER=http://localhost:8000

# Build and run with Docker Compose
docker-compose up --build

# Access application at http://localhost:3100
```

### Production
```bash
# Set environment variables
export VITE_APP_BACKEND_URL=https://api.production.com
export VITE_APP_BACKEND_URL_MASTER=https://master-api.production.com

# Build and run
docker-compose up --build
```

### Server Deployment
```bash
# Set environment variables in Linux
echo 'export VITE_APP_BACKEND_URL=https://api.production.com' >> ~/.bashrc
echo 'export VITE_APP_BACKEND_URL_MASTER=https://master-api.production.com' >> ~/.bashrc
source ~/.bashrc

# Build and run
docker-compose up --build -d
```

## Benefits of This Approach

1. **Simpler Setup**: No entrypoint script needed
2. **Better Performance**: No runtime environment substitution
3. **Linux Native**: Uses Linux environment variables directly
4. **Static Files**: Nginx serves pre-built static files
5. **Security**: Environment variables are baked into build

## Important Notes

- **Rebuild Required**: Environment changes require rebuilding the image
- **Environment Variables**: Must be set before building
- **Static Deployment**: Application is completely static after build

## Troubleshooting

### Environment Variables Not Loading
1. Verify environment variables are set before building
2. Check Docker Compose build args
3. Check browser console for JavaScript errors

### Build Issues
1. Ensure environment variables are exported
2. Check Docker Compose configuration
3. Verify Vue build process
