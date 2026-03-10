# Runbook - Autostart en PC del trabajo

## Objetivo

Cuando el sistema se migre a la PC servidor de la institucion, evitar levantar manualmente Docker Compose en cada reinicio.

## Alcance

Este runbook **no se aplica en la PC actual de desarrollo**.
Se ejecutara solo en la PC del trabajo destinada a servidor local.

## Estrategia recomendada

1. Configurar `docker compose` con politicas `restart: unless-stopped`.
2. Crear servicio `systemd` para levantar el stack al boot.
3. Verificar salud de backend/frontend luego del reinicio.

## Paso a paso (PC del trabajo)

1) Crear archivo de servicio:

`/etc/systemd/system/ees23-compose.service`

```ini
[Unit]
Description=EES23 Docker Compose Stack
After=network-online.target docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/ees23-panel-escolar
ExecStart=/usr/bin/docker compose -f infra/docker/docker-compose.dev.yml up -d
ExecStop=/usr/bin/docker compose -f infra/docker/docker-compose.dev.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

2) Activar servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ees23-compose.service
sudo systemctl start ees23-compose.service
```

3) Verificar:

```bash
sudo systemctl status ees23-compose.service
docker compose -f infra/docker/docker-compose.dev.yml ps
```

## Checklist de validacion

- `http://localhost:3000` responde frontend
- `http://localhost:8000/health` responde `{"status":"ok"}`
- `http://localhost:8000/docs` accesible

## Nota operativa

En el servidor final conviene usar un compose de produccion local (sin `--reload`, con backups y politicas de logs).
