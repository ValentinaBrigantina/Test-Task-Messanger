# Test-Task-Messenger

## Stack

- Bun
- Hono, Hono RPS
- TypeScript
- Drizzle ORM
- PosgreSQL
- WebSocket
- Zod (validator)

Client:
- React 18
- Vite
- Tanstack Router, Query, and Form
- Tailwind

##  Installation and Setup
### API Setup
To install dependencies and run the API:

```bash
touch .env | cp .env.example .env # Create environment file
bun install # Install dependencies
bun dev # to Run the server
```

### Client Setup
To install dependencies and run the client:

```bash
touch frontend/.env | cp frontend/.env.example frontend/.env # Create environment file
cd frontend # Move to client directory
bun install # Install dependencies
bun dev # Run the client
```

### Database Setup
To run the database:

```bash
bun db:generate # Generate schema
bun db:up # Run Docker container with the database
bun db:migrate # Apply migrations
bun db:studio # Launch Drizzle Studio at https://local.drizzle.studio
```

#### Create Admin
To create an admin user, use the following command:
```bash
curl -X POST http://localhost:3000/api/admin/create \
-H "Content-Type: application/json" \
-d '{"name": "Admin", "password": "Admin"}'
```

## Technical Requirements

### Test Task for Full-Stack Node.JS Developer

Develop an online chat application with the following functionalities and requirements:

#### Functionality

- **User Registration and Authentication**
- **User Profile Management**:
  - Ability to change password.
  - Upload a profile picture, which will be displayed in chats.
- **Messaging**:
  - Send text messages and images to other users in a one-on-one (dialog) format.
- **Group Chat (Conferences)**:
  - Create group chats with multiple users.
- **Chat History**:
  - Preserve message history for each chat session.
- **Admin-Only User Data API**:
  - API endpoint that provides information about all registered users (ID and name) as a JSON object.
  - This endpoint should be secured and accessible only by an admin.