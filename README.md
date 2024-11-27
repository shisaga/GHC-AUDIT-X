# Green Home Consulting Audit Management System

## Overview

The Green Home Consulting Audit Management System is a web-based application designed to streamline and optimize audit management processes for environmental and home consulting services. The system provides a comprehensive solution for managing audits, user roles, and financial transactions.

## Key Features

- **Audit Management**: Create, track, and manage audits efficiently
- **User Management**: Robust role-based access control (RBAC)
- **Financial Tracking**: Generate invoices and manage payment statuses
- **Accessibility**: Web-based platform accessible from any device

## Role-Based Access Control (RBAC)

The system implements a sophisticated RBAC model with four distinct user roles:

### 1. Admin
- **Full System Access**
  - Create, update, and delete audits
  - Manage user accounts and roles
  - Generate comprehensive invoices
  - Update payment statuses
  - Unrestricted system configuration

### 2. Auditor
- **Limited Audit Creation**
  - Create audits only for themselves
  - Cannot update payment statuses
  - Cannot add additional costs to audits
  - View assigned audits

### 3. Contractor
- **View-Only Access**
  - View personal audits
  - View associated invoices
  - No modification capabilities

### 4. Manager
- **Supervisory Access**
  - Similar permissions to Admin
  - Cannot update payment statuses
  - Cannot generate summary invoices
  - Oversight of audit and user management

## System Requirements

- Modern web browser
- Stable internet connection
- No specific hardware requirements

## Getting Started

### Access the System
1. Navigate to: http://app.greenhomeconsulting.ca/
2. For new users: Click "Sign Up"
3. Existing users: Log in with credentials

## Technical Stack

- **Frontend**: React, Next.js
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Form Handling**: Formik
- **Validation**: Yup
- **Authentication**: Cookies-based

## Development

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/green-home-consulting-ams.git

# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Green Home Consulting - support@greenhomeconsulting.ca

## Project Links
- **Website**: http://app.greenhomeconsulting.ca/
- **Documentation**: [Link to full documentation]
- **Issue Tracker**: [Link to issue tracking system]
