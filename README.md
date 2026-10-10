# AI Virtual Try-On - Frontend

This repository contains the frontend application for the AI Virtual Try-On platform. The application provides an interactive user interface for users to upload their photos, select garments from a catalog, and preview how the garments would look on them using advanced generative AI.

## Tech Stack

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS 4
*   **Icons:** Lucide React
*   **Animation:** Framer Motion

## Architecture Overview

The frontend is a Single Page Application (SPA) that communicates with the backend via RESTful APIs. It manages state for the virtual trial room workspace, handles image file uploads, and renders the high-fidelity AI-generated try-on results. API calls are managed through a dedicated service layer, and environment variables are used to seamlessly route requests between local development servers and production environments.

## Setup Instructions

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd ai_virtual_tryon_frontend
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env` file in the root of the frontend directory (if not already present) and specify the backend API URL. For local development, this is typically:
    ```env
    VITE_API_URL="http://localhost:3000/api"
    ```

### Running the Application

To start the local development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`. 

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist` directory containing the static assets, which can be deployed to static hosting platforms such as Vercel, Netlify, or AWS S3.
"# ai_virtual_tryon_frontend" 
