Backend README (Current Version)
Event Management Platform with AI
Overview

The Event Management Platform with AI is a full-stack event management system built using FastAPI, PostgreSQL, and Ollama LLM.

It provides complete event lifecycle management, secure authentication, role-based access control, email communication, analytics dashboards, and AI-powered planning and decision support.

Tech Stack
Backend
FastAPI
SQLAlchemy ORM
PostgreSQL
Alembic
JWT Authentication
APScheduler
AI
Ollama
LangChain
Qwen2.5
Communication
SMTP Email
HTML Email Templates
Database
PostgreSQL
Features
Authentication
User Registration
Login
JWT Authentication
Role-Based Access Control
Event Management
Event CRUD
Venue CRUD
Speaker CRUD
Sponsor CRUD
Vendor CRUD
Session CRUD
Registration
Register for Events
Cancel Registration
My Registrations
Ticketing
Ticket Generation
Ticket Retrieval
Payments
Payment Management
Check-In
QR / Check-in Support
Feedback
Feedback Submission
Ratings
Certificates
Certificate Management
Communication
SMTP Email
Reminder Emails
AI Generated Emails
Professional HTML Emails
AI Features
AI Planning Assistant

Generates personalized event plans using:

Event Details
Venue
Speakers
Sessions
Sponsors
Vendors
AI Chat Assistant

Interactive AI chatbot capable of answering organizer questions.

Example:

How can I improve attendance?
AI Email Generator

Generates

Invitations
Reminders
Thank-you Emails

Supports professional HTML email templates.

AI Reports

Generates professional event reports.

AI Analytics

Analyzes:

Strengths
Weaknesses
Risks
Recommendations
AI Health Score

Calculates:

Health Score
Risk Level
Strengths
Weaknesses
AI Attendance Prediction

Predicts future attendance using current event data.

AI Success Prediction

Predicts event success probability.

AI Budget Advisor

Provides:

Budget Analysis
Cost Optimization
Financial Recommendations
AI Dashboard Insights

Summarizes event performance.

AI Decision Support

Provides strategic recommendations for organizers.

Admin Dashboard APIs
Analytics
GET /admin/dashboard/analytics

Returns:

Events
Registrations
Revenue
Speakers
Sessions
Sponsors
Vendors
Feedback
Charts
GET /admin/dashboard/charts

Returns:

Monthly Registrations
Monthly Revenue
Event Status Distribution
Feedback Distribution
Top Events
Production APIs
GET /health
GET /info
Project Structure
backend/
│
├── ai/
├── api/
├── communication/
├── core/
├── database/
├── middleware/
├── models/
├── repositories/
├── scheduler/
├── schemas/
├── services/
├── templates/
├── utils/
└── main.py
Install

Clone the repository

git clone <repository-url>

Create virtual environment

python -m venv venv

Activate

Windows

venv\Scripts\activate

Linux/macOS

source venv/bin/activate

Install dependencies

pip install -r requirements.txt


Environment Variables

Create a .env file

DATABASE_URL=postgresql://username:password@localhost/event_management

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

OLLAMA_BASE_URL=http://localhost:11434

OLLAMA_MODEL=qwen2.5:1.5b
Run the Server
uvicorn backend.main:app --reload
API Documentation

Swagger UI

http://127.0.0.1:8000/docs

ReDoc

http://127.0.0.1:8000/redoc