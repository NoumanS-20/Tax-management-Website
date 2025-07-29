# FinStack - Smart ITR Filing Platform

A comprehensive React TypeScript application for Indian Income Tax Return (ITR) filing and management. Built with modern web technologies to provide a seamless tax filing experience for individuals, CAs, and administrators.

## 🚀 Features

### 👥 Multi-Role User System
- **Individual Taxpayers**: Personal tax filing dashboard with document management
- **CAs/Tax Consultants**: Client management and ITR review capabilities
- **System Administrators**: Platform-wide analytics and user management

### 📊 Dashboard Analytics
- Real-time financial data visualization
- Income trends and tax liability tracking
- Platform growth metrics for administrators
- Interactive charts using Recharts

### 📁 Document Management
- Drag-and-drop file upload interface
- Support for multiple file types (PDF, images, documents)
- Document categorization (Form 16, bank statements, etc.)
- Status tracking (pending, verified, rejected)
- Search and filter functionality

### 🔐 Authentication & Security
- Role-based access control
- Protected routes with automatic redirection
- Session management with localStorage
- Mock authentication system (ready for backend integration)

### 🎨 Modern UI/UX
- Clean, professional interface with Tailwind CSS
- Responsive design for all devices
- Interactive components with hover effects
- Toast notifications for user feedback
- Loading states and smooth transitions

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **File Handling**: HTML5 File API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tax-management-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 👤 Demo Accounts

The application includes demo accounts for testing different user roles:

### Individual Taxpayer
- **Email**: `user@finstack.com`
- **Password**: `password`
- **Features**: Personal dashboard, document upload, ITR progress tracking

### System Administrator
- **Email**: `admin@finstack.com`
- **Password**: `password`
- **Features**: Platform analytics, user management, system monitoring

### CA/Tax Consultant
- **Email**: `accountant@finstack.com`
- **Password**: `password`
- **Features**: Client management, ITR review queue, reports

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard/      # Dashboard-specific components
│   │   ├── StatsCard.tsx
│   │   └── FinancialChart.tsx
│   ├── Layout/         # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── UI/            # Basic UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   └── FileUpload/     # Document upload components
├── pages/              # Main application pages
│   ├── Auth/          # Authentication pages
│   │   └── Login.tsx
│   ├── Dashboard/      # Dashboard pages
│   │   ├── UserDashboard.tsx
│   │   └── AdminDashboard.tsx
│   └── Documents/      # Document management
│       └── DocumentManager.tsx
├── context/            # React Context for state management
│   └── AuthContext.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎯 Key Features Explained

### Document Management
- Upload multiple file types (PDF, JPG, PNG, DOC, DOCX)
- Automatic file size validation (max 10MB)
- Document categorization and status tracking
- Search and filter capabilities
- Preview, download, and delete operations

### Dashboard Analytics
- **User Dashboard**: Personal financial overview, ITR progress, tax tips
- **Admin Dashboard**: Platform metrics, user distribution, system alerts
- **Interactive Charts**: Income trends, tax liability, platform growth

### Authentication System
- Mock authentication with role-based access
- Automatic session restoration
- Protected routes with loading states
- Logout functionality with session cleanup

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Database connectivity
- [ ] PDF generation for ITR forms
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Advanced tax calculator
- [ ] E-filing integration with Income Tax Department

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Indian tax filing community**
