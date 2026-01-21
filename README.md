# Postlytics

Postlytics is a modern, full-stack analytics dashboard and social platform application. It features a robust backend built with **Ruby on Rails 8** and a dynamic, responsive frontend using **React 19**, **TypeScript**, and **Tailwind CSS 4**.

## 🚀 Technologies

### Backend
-   **Framework**: Ruby on Rails 8.0.2
-   **Database**: PostgreSQL 14
-   **Authentication**: Devise + JWT
-   **API**: RESTful API structure

### Frontend
-   **Build Tool**: Vite
-   **Framework**: React 19
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS 4
-   **Charts**: Recharts
-   **Icons**: Lucide React
-   **Routing**: React Router 7
-   **State/Data**: Axios, React Hooks

## 🛠️ Prerequisites

-   **Docker** and **Docker Compose** installed on your machine.
-   Make sure ports **3000** (Backend) and **3001** (Frontend) are available.

## 🏁 Getting Started

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ryanDevCode/postlytics
    cd postlytics
    ```

2.  **Start the services**:
    ```bash
    docker-compose up --build
    ```
    This command will build the images and start the backend, frontend, and database containers.

3.  **Access the Application**:
    -   **Frontend**: Open [http://localhost:3001](http://localhost:3001) in your browser.
    -   **Backend API**: Running at `http://localhost:3000`.

## 📜 Scripts

### Docker
-   `docker-compose up`: Start the application.
-   `docker-compose down`: Stop the application and remove containers.
-   `docker-compose run backend rails db:seed`: Seed the database with sample data (users, posts, analytics).

### Frontend (Local Development)
If you wish to run the frontend locally without Docker:
```bash
cd frontend
npm install
npm run dev
```

### Backend (Local Development)
If you wish to run the backend locally without Docker:
```bash
cd backend
bundle install
rails db:create db:migrate
rails s
```
*(Note: Ensure you have a running Postgres instance configured in `config/database.yml` or ENV vars)*

## ✨ Features

-   **User Authentication**: Secure login and signup flows using JWT.
-   **Analytics Dashboard**:
    -   Interactive charts (Bar, Line, Area, Pie) visualizing daily posts and comments.
    -   Date range filtering and Hashtag search.
    -   Summary cards for key metrics.
    -   Paginated data tables for recent activity.
-   **Social Feed**:
    -   Browse posts with infinite scrolling.
    -   Sidebar with trending topics and recent activity.
-   **AI Sentiment Analysis** 🤖:
    -   Automatic sentiment detection on posts and comments.
    -   Classifies content as `positive`, `negative`, or `neutral`.
    -   Extensible architecture ready for OpenAI/Anthropic API integration.
-   **Real-Time Features** ⚡:
    -   Live comment updates via ActionCable WebSockets.
    -   Real-time typing indicators (coming soon).
-   **Role-Based Access Control (RBAC)**: Admin and User roles (configured in backend).
-   **Responsive Design**: Fully responsive layout optimized for desktop and mobile.

## 🧪 Testing

This project includes a comprehensive testing suite demonstrating professional development practices.

### Backend (RSpec)
```bash
cd backend
bundle exec rspec
```
- Model specs for `User` and `Post`
- Factory definitions with FactoryBot
- Faker for realistic test data

### Frontend (Vitest)
```bash
cd frontend
npm run test
```
- Component smoke tests with React Testing Library
- Fast, Vite-native test runner

## 🏗️ Architecture Highlights

| Component | Technology | Purpose |
|-----------|------------|---------|
| API Authentication | Devise + JWT | Stateless token-based auth |
| Real-time | ActionCable | WebSocket connections |
| Sentiment Analysis | `SentimentAnalyzer` Service | NLP-ready service object pattern |
| State Management | React Hooks | Modern functional components |
| Testing | RSpec + Vitest | Full-stack coverage |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

