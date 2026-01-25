# V-Excel Student Portal - Installation Guide

Here is how to run this project on your machine.

## Prerequisites
1.  **Node.js**: Install from [nodejs.org](https://nodejs.org/). (Version 18+ recommended)
2.  **PostgreSQL**: Install and make sure it's running.

## Setup Instructions

1.  **Unzip the folder** and open it in a terminal (VS Code recommended).

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Database**:
    *   Create a `.env` file in the root folder (if missing) and add your database URL:
        ```
        DATABASE_URL="postgresql://postgres:password@localhost:5432/vexcel_db?schema=public"
        ```
        *(Replace `postgres:password` with your actual Postgres username and password)*.

4.  **Initialize Database**:
    Run these commands to create tables and add sample data:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Run the App**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to see the app!

## Features
*   **Student Profile**: View "Rahul S." details.
*   **Upload Reports**: Go to "Plans & Reports" to upload PDF/Text files.
*   **Responsive UI**: Works on mobile and desktop.
