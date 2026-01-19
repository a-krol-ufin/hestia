# Hestia

Hestia is a comprehensive home management application designed to streamline daily household tasks. It currently facilitates shopping list management, budget planning, and payment reminders, with an extensible architecture intended to support a wide range of future functionalities.
<img width="1504" height="801" alt="image" src="https://github.com/user-attachments/assets/0db1c96a-857c-4c0c-aea6-490674687b0e" />

## Technology Stack

The application utilizes a modern, performance-oriented technology stack:

- **Frontend**: Vue.js (Self-hosted)
- **Backend**: PocketBase (Self-hosted)

## Getting Started

This project is containerized using Docker to ensure consistent deployment environments.

### Prerequisites

- Docker
- Docker Compose

### Deployment

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Start the application services:

```bash
docker-compose up -d --build
```

### Accessing the Application

Once the services are running, the application components can be accessed at the following addresses:

- **Frontend Application**: http://localhost:8080
- **PocketBase Admin UI**: http://localhost:8090/_/

## Credits

Developed by Antoni Krol BrightStack.

## License

This project is open source.
