# gambio-gx4802 (Gambio GX 4.8.0.2)

## Setup on Local Machine

### Prerequisites
- Docker
- Docker Compose

### Start
```bash
docker compose up -d
```

### URLs
- Shop: `http://localhost:8080/`
- Installer (if not installed yet): `http://localhost:8080/gambio_installer/`
- Admin Login: `http://localhost:8080/login_admin.php`

### Database (for installer)
- Host: `db`
- Database: `gambio`
- User: `gambio`
- Password: `gambio`
- Root password: `root`

### Stop
```bash
docker compose down
```

## Setup on GitHub Codespaces

### Start
```bash
docker compose up -d
```

### Ports
- `8080` for web
- `3306` for database

For browser access, set port `8080` visibility to `Public` in the Codespaces **Ports** tab.

### URLs
Replace `<codespace-name>` with your actual Codespace name.

- Shop: `https://<codespace-name>-8080.app.github.dev/`
- Installer (if not installed yet): `https://<codespace-name>-8080.app.github.dev/gambio_installer/`
- Admin Login: `https://<codespace-name>-8080.app.github.dev/login_admin.php`

Example:
- `https://fuzzy-spoon-4vjpvrwwwr6fqj46-8080.app.github.dev/`

### Database (for installer)
- Host: `db`
- Database: `gambio`
- User: `gambio`
- Password: `gambio`
- Root password: `root`
