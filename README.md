# 🚨 Real-Time Disaster Alert & Coordination Platform

![Platform Screenshot](<img width="1913" height="992" alt="proj12" src="https://github.com/user-attachments/assets/2682a7fc-1f96-47e7-8317-eaf1a0ff9190" />) 

## 📜 Description

In the critical moments of a disaster, information is the most vital resource. Traditional communication channels are often slow, fragmented, and prone to misinformation. This platform is designed to solve that problem by creating a unified, real-time hub for disaster reporting and coordination.

This full-stack application empowers citizens to report incidents with photos and videos, while enabling authorities (Admins) and aid organizations (NGOs) to verify information and coordinate the distribution of resources. It's a life-saving tool built on modern, scalable technology.

***

## ✨ Key Features

### 🗺️ For All Users
* **Real-Time Interactive Map:** A live map showing the location of all verified reports and available NGO resources.
* **Secure User Authentication:** A complete login/signup system using JWT for secure, persistent sessions.
* **Crowd-Sourced Reporting:** Users can submit detailed incident reports, including descriptions, images (up to 2MB), and videos (up to 50MB).
* **Instant SOS Alerts:** A dedicated SOS feature that broadcasts an emergency alert to nearby NGOs and volunteers in real-time.
* **Geospatial Filtering:** The ability to search for reports and resources within a specific geographic radius.

### 👑 For Admins
* **Admin Dashboard:** A protected panel displaying all submitted reports in a clean, manageable list.
* **One-Click Verification:** Admins can verify pending crowd-sourced reports, instantly changing their status to "verified" for all users to see.
* **Platform Statistics:** An exclusive stats endpoint to view high-level metrics like total users, reports, and resource availability.

### 🤝 For NGOs
* **NGO Dashboard:** A protected panel for registered NGOs to manage their aid efforts.
* **Resource Management:** NGOs can post their available resources (e.g., food, water, shelter) at their current location, making them visible on the main map.

***

## 💻 Tech Stack

* **Frontend:**
    * **React 18:** For building a dynamic and responsive user interface.
    * **React Router:** For client-side routing and navigation.
    * **Axios:** For making API requests to the backend.
    * **Socket.io-Client:** For real-time communication.
    * **Leaflet & React-Leaflet:** For the interactive map display.
    * **CSS Modules:** For scoped, maintainable styling.

* **Backend:**
    * **Node.js:** As the JavaScript runtime environment.
    * **Express.js:** As the web server framework.
    * **MongoDB:** As the NoSQL database for storing all application data.
    * **Mongoose:** As the Object Data Modeler (ODM) for MongoDB.
    * **JSON Web Tokens (JWT):** For secure, token-based authentication.
    * **Socket.io:** For enabling real-time, bidirectional communication.
    * **Multer & Cloudinary:** For handling and storing media file uploads.

***

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

* **Node.js** (v18 or later)
* **MongoDB** installed locally or a connection string from MongoDB Atlas.
* A free **Cloudinary** account for handling image and video uploads.

### ⚙️ Backend Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    * Rename the `.env.example` file to `.env`.
    * Open the `.env` file and fill in your configuration details:
        ```env
        PORT=5000
        NODE_ENV=development
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=a_long_random_and_secret_string_for_jwt
        CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
        CLOUDINARY_API_KEY=your_cloudinary_api_key
        CLOUDINARY_API_SECRET=your_cloudinary_api_secret
        ```

4.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:5000`.

### 🎨 Frontend Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

You're all set! You can now register a new user, log in, and explore the platform's features.
