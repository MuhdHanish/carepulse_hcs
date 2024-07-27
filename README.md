# CasePulse

**CasePulse** is an advanced healthcare management system designed to streamline interactions between patients and medical staff. The system provides various features to manage appointments, handle user registrations, and monitor appointment statistics efficiently.

## Features

### User Management
- **Create Account**: Allows users to create an account by entering basic details.
- **Register**: Enables patients to register for appointments by providing basic and personal details, medical information, primary physician details, identification, verification, and content privacy settings.

### Appointment Management
- **New Appointment**: Schedule new appointments by specifying the doctor, date and time, reason, and additional notes.
- **Admin Dashboard**: 
  - **Admin Authentication**: Admins can verify their access using a passkey.
  - **Stats Cards**: View statistics with counts of pending, scheduled, and canceled appointments.
  - **Appointments Table**: Manage appointments with various actions.
  - **Schedule Appointment**: Admins can schedule appointments by selecting a doctor, adding notes, specifying reasons, and setting the date and time.
  - **Cancel Appointment**: Admins can cancel appointments with reasons provided.

### Notifications
- **SMS Notifications**: When appointments are scheduled or canceled, an SMS notification is sent to the patient using Twilio's service. (Currently configured to send only to a specific number using Twilio’s free tier).

### Error Tracking and Notifications
- **Sentry**: Integrated with Sentry for error tracking and monitoring.
- **Sonner**: Utilizes toast notifications for form submission success messages.

## Tech Stack

- **Frontend**: 
  - **Next.js**: Framework for server-rendered React applications.
  - **TypeScript**: Typed JavaScript for enhanced code quality and maintainability.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
  - **Shadcn**: Component library for UI elements.
  - **React Hook Form**: Library for managing form state with Zod for validation.
- **Backend**: 
  - **Appwrite**: Backend server for authentication, database, and file storage, including Appwrite Messaging for notifications.
  - **Twilio**: SMS service for sending notifications.
- **Error Tracking**: Sentry (for tracking and managing errors).
- **Notifications**: Sonner (for toast notifications on form submit success).

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/MuhdHanish/carepulse_hcs.git
   ```

2. **Install Dependencies**:

   Navigate to the project directory and install the dependencies:

   ```bash
   cd carepulse_hcs
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory based on the `.env.example` file provided:

   ```bash
   cp .env.example .env
   ```

   Then, fill in the required environment variables with your actual values in the `.env` file.

4. **Start the Application**:

   Run the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

Ensure all necessary variables are provided for the application to run correctly. The required variables can be found and set in the `.env.example` file. Copy this file to `.env` and fill in the appropriate values.

## Feedback

If you have any feedback, please reach me at [muhammedhanish11@gmail.com](mailto:muhammedhanish11@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/muhdhanish/).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the project's coding standards and include relevant tests.

## Support

Show your support by 🌟 the project!!