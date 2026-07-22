# DevFlow

DevFlow is a full-stack project management and team collaboration platform built to help organizations manage projects, tasks, team members, and workflows efficiently.

The platform provides role-based access control, task management, activity tracking, notifications, attachments, dashboards, and collaboration features, making it suitable for software teams, student projects, startups, and internal company workflows.

## Features

### Authentication & Security

* User Registration and Login
* JWT Authentication
* Refresh Token Support
* Protected Routes
* Password Hashing with bcrypt
* Input Validation using Zod

### Organization Management

* Create Organizations
* Update Organization Details
* Invite Team Members
* Remove Members
* Change Member Roles
* Role-Based Access Control

### Project Management

* Create Projects
* View Organization Projects
* Project Organization Mapping

### Task Management

* Create Tasks
* Update Tasks
* Delete Tasks
* Change Task Status
* Assign Tasks to Team Members
* Unassign Tasks
* Track Task Progress

### Comments & Collaboration

* Add Comments to Tasks
* Edit Comments
* Delete Comments
* View Task Discussions

### Activity Logs

* Automatic Activity Tracking
* Task Creation Logs
* Status Change Logs
* Assignment Logs
* Comment Activity Logs
* Organization Activity Feed

### Dashboard & Analytics

* Total Projects
* Total Tasks
* Task Distribution by Status
* Member Statistics
* Organization Overview Dashboard

### Attachments

* Add Attachments to Tasks
* View Task Attachments
* Delete Attachments

### Notifications

* Task Assignment Notifications
* Task Status Notifications
* Comment Notifications
* Mark Notifications as Read

## Tech Stack

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Zod Validation

### Frontend

* React
* React Router
* Axios
* Tailwind CSS

## Database Design

Main Entities:

* User
* Organization
* OrganizationMember
* Project
* Task
* Comment
* ActivityLog
* Attachment
* Notification

Relationships:

* Users can belong to multiple organizations.
* Organizations contain multiple projects.
* Projects contain multiple tasks.
* Tasks support comments and attachments.
* Organization members receive notifications.
* Activities are tracked across the platform.

## API Modules

### Auth

* Signup
* Login
* Logout
* Refresh Token

### Organizations

* Create Organization
* List Organizations
* Update Organization
* Manage Members

### Projects

* Create Project
* List Projects

### Tasks

* Create Task
* Update Task
* Delete Task
* Assign Task
* Change Status

### Comments

* Create Comment
* Edit Comment
* Delete Comment

### Activity

* View Organization Activity Feed

### Dashboard

* View Organization Statistics

### Notifications

* Get Notifications
* Mark Notification as Read

### Attachments

* Add Attachment
* Delete Attachment
* View Attachments

## Future Improvements

* Real File Uploads using Cloudinary or AWS S3
* Real-Time Notifications with WebSockets
* Project-Level Permissions
* Search and Filtering
* Pagination
* Docker Support
* Redis Caching
* Swagger API Documentation
* Unit and Integration Testing
* CI/CD Pipeline
* Email Notifications

## Learning Outcomes

This project helped in understanding:

* REST API Design
* Authentication & Authorization
* Database Modeling
* Prisma ORM
* Backend Architecture
* Role-Based Access Control
* Team Collaboration Systems
* Frontend-Backend Integration
* Full Stack Development

## Author

Aditya Dutta
B.Tech Computer Science, BIT Mesra
