# OmniRetail POS Platform

An enterprise-grade, multi-store retail Point of Sale (POS) and inventory management web platform built with Node.js, Express, MongoDB, and Handlebars. Designed for modern retail workflows, barcode scanning, order processing, and multi-tier store operations.

---

## Features Overview

- **Point of Sale (POS) & Checkout:** Real-time product search, barcode generation/lookup, dynamic cart calculation, and customer order management.
- **Inventory & Catalog Management:** Product cataloging with SKU/barcode association, category filtering, stock tracking, and asset handling.
- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities tailored for Chain Administrators and Store Employees.
- **Reporting & Business Analytics:** Real-time aggregation of sales metrics, transaction histories, and staff performance statistics.
- **Flexible UI Theming:** Lightweight, responsive design supporting dynamic light and dark presentation modes.

---

## Architecture & Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Template Engine:** Express Handlebars (`hbs`)
- **Styling & Assets:** Sass (Dart Sass), Bootstrap, SVG illustrations
- **Containerization:** Docker & Docker Compose (Database service)

---

## Prerequisites

Ensure your environment meets the following baseline requirements before setting up the application:

### 1. Node.js
Requires **Node.js (LTS version recommended)** and **npm**.

- **Windows:**
  - Install via Windows Package Manager:
    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```
  - Or download the official installer directly from [nodejs.org](https://nodejs.org/).
- **macOS / Linux:**
  - Install via Homebrew or official package managers:
    ```bash
    brew install node
    ```
- **Verification:**
  ```bash
  node -v
  npm -v
  ```

### 2. Docker & Docker Compose
Used to orchestrate the local MongoDB instance.
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Ensure the Docker daemon is running:
  ```bash
  docker --version
  docker-compose --version
  ```

---

## Quick Start & Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd omniretail-pos
```

### Step 2: Configure Environment Variables
Copy the sample environment configuration file and adjust variables as necessary:
```bash
cp .env.example .env
```
*(If running purely on default local settings, verify that `PORT` and `MONGODB_URI` match your setup).*

### Step 3: Start the Database
Spin up the containerized MongoDB service in detached mode:
```bash
docker-compose up -d
```

### Step 4: Install Dependencies
Install all required production and development dependencies:
```bash
npm install
```

### Step 5: Run the Application

- **Development Mode (with auto-reload and inspection):**
  ```bash
  npm start
  ```
- **Style Compilation (watching SCSS changes in a separate terminal):**
  ```bash
  npm run watch
  ```

Once the terminal outputs:
```text
Connect to DB successfully !!!
```
The server is live and listening on **[http://localhost:3000](http://localhost:3000)**.

---

## Access & Authentication

Open your web browser and navigate to `http://localhost:3000`. You will be greeted by the Welcome portal. Click **Get Started** to log in.

### Default Credentials for Local Testing

| Role | Username | Password | Permissions Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin` | Full system access, staff invitation, reports, product catalog |
| **Employee** | `johndoe` | `johndoe` | POS terminal, checkout, customer lookup, order history |

> **Security Notice:** The default credentials above are provisioned strictly for initial local evaluation. All administrative credentials must be updated before production deployment.

---

## Stopping the Application

1. Stop the application server by pressing `Ctrl + C` in the running terminal window.
2. Stop and dismantle the database container:
   ```bash
   docker-compose down
   ```

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── controllers/      # Business logic and request handlers
│   │   └── models/           # Mongoose schemas and data entities
│   ├── config/               # Database and environment configurations
│   ├── resources/
│   │   ├── scss/             # Sass source styling
│   │   └── views/            # Handlebars templates, partials, and layouts
│   ├── routes/               # Modular Express routing definitions
│   ├── utils/                # Helper functions and formatters
│   └── index.js              # Application entry point
├── docker-compose.yml        # Docker composition services
├── package.json              # Project manifests, dependencies, and scripts
└── README.md                 # Project documentation
```

---

## License

This project is licensed under the [MIT License](LICENSE).