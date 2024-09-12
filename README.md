
# Workspace Management Application

This application allows users to register, log in, and manage workspaces. The backend is built using NestJS, and the frontend uses React. It includes JWT-based authentication and workspace CRUD operations with a feature to check the availability of workspace slugs and suggest alternatives.

## Features

### Authentication
- **Login** (POST `/auth/login`): Allows users to log in using their email and password. Returns an access token.
- **Register** (POST `/auth/register`): Allows new users to sign up with an email, password, and first name.
- **Refresh** (GET `/auth/refresh`): Generates a new access token.
- **Logout** (POST `/auth/logout`): Ends the user session.

### Workspace Management
- **Create Workspace** (POST `/workspace/create`): Input: Workspace name and slug. Output: Workspace name, slug, user ID, and workspace ID.
- **Get Workspaces** (GET `/workspace`): Returns an array of workspaces associated with the logged-in user.
- **Check Slug Availability** (GET `/workspace/check?slug={slug}`): Checks if a workspace slug is available. If unavailable, returns 5 alternative slug suggestions.
- **Delete Workspace** (DELETE `/workspace/{id}`): Deletes the workspace with the given ID.

## Frontend Functionality

- **Home Page**: The main landing page with a navbar containing links to Home and Workspace.
- **Authentication**: Users must log in or register to access the Workspace page.
- **Workspace Page**: Displays a table of workspaces (ID, slug, name) with a delete button. Includes a button to create a new workspace.
- **Slug Availability Check**: When creating a new workspace, the slug is checked in real-time for availability. If the slug is taken, 5 alternative suggestions are displayed. Clicking on a suggestion auto-fills the slug input field.
  
## Technologies Used

- **Frontend**: ReactJS, Next.js
- **Backend**: NestJS, Node.js, Express
- **Database**: MySQL or MongoDB

## Getting Started

### Prerequisites
- Node.js and npm installed.
- MySQL or MongoDB set up and running.

### Backend Setup
1. Navigate to the server folder:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up the database connection in `.env` file.
4. Run the application:
    ```bash
    npm run start
    ```

### Frontend Setup
1. Navigate to the client folder:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the application:
    ```bash
    npm run start
    ```

### Database Schema

#### Users Table
| Column    | Type    | Description              |
|-----------|---------|--------------------------|
| id        | INT     | Primary key               |
| fullName  | VARCHAR | Full name of the user     |
| email     | VARCHAR | Email of the user         |
| password  | VARCHAR | Hashed password           |

#### Workspaces Table
| Column  | Type    | Description                  |
|---------|---------|------------------------------|
| id      | INT     | Primary key                   |
| userId  | INT     | Foreign key (User ID)         |
| name    | VARCHAR | Name of the workspace         |
| slug    | VARCHAR | Unique workspace slug (alias) |

## License

This project is licensed under the MIT License.
