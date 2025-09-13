# FRA Portal - Forest Rights Administration Dashboard

A comprehensive digital platform for tracking, visualizing, and managing Forest Rights Act claims across India. Built with React, TypeScript, and modern web technologies.

## 🚀 Demo Version

This is a **fully functional demo** that works without requiring Firebase setup or paid services. You can test all features immediately!

### 🎯 How to Test the Demo

1. **Visit the live site** (deployed on Netlify)
2. **Click "Sign In"**
3. **Use any email/password** (e.g., `admin@fraportal.com` / `admin123`)
4. **Or click "Continue with Google"** for demo Google authentication
5. **Select your role** (Government or Local User)
6. **Explore all features** - everything works in demo mode!

### 🔑 Demo Credentials

- **Government User**: `admin@fraportal.com` / `admin123`
- **Local User**: `user@fraportal.com` / `user123`
- **Google Demo**: Click "Continue with Google" for instant access

## 🌟 Features

### 🏛️ Government Dashboard
- **Interactive Map View** - Visualize forest rights claims across different regions
- **Claims Management** - Review, approve, or reject forest rights applications
- **Analytics Dashboard** - Comprehensive statistics and reporting
- **Alert System** - Create and manage alerts for important updates
- **Complaints Management** - Handle complaints and issues from local users
- **Real-time Data** - Live updates on claim statuses and statistics

### 👥 Local User Dashboard
- **Claim Tracking** - Monitor your forest rights applications
- **Interactive Map** - View your claims on an interactive map
- **Complaint System** - Submit and track complaints
- **Alert Notifications** - Receive important updates and alerts
- **Analytics** - View statistics relevant to your region

### 📱 Mobile Responsive Design
- **Mobile-First Approach** - Optimized for all device sizes
- **Touch-Friendly Interface** - Easy navigation on mobile devices
- **Hamburger Menu** - Clean mobile navigation
- **Mobile Control Panel** - Access all features on mobile
- **Responsive Grid Layouts** - Content adapts to screen size

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Authentication**: Firebase Auth (with mock fallback)
- **Maps**: Interactive map components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Victorraj020/FRA.git
   cd FRA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 User Roles

### Government Users
- Access to comprehensive dashboard
- Map view opens by default
- Full claims management capabilities
- Analytics and reporting tools
- Alert and complaint management

### Local Users
- Personal dashboard for claim tracking
- Complaint submission system
- Alert notifications
- Regional analytics

## 📱 Mobile Features

- **Responsive Design** - Works seamlessly on all devices
- **Mobile Navigation** - Hamburger menu for easy access
- **Touch Optimized** - Large buttons and touch-friendly interface
- **Mobile Control Panel** - Full feature access on mobile
- **Offline Capable** - Basic functionality works offline

## 🔧 Key Components

- **Authentication System** - Secure login with Firebase
- **Role-Based Access** - Different dashboards for different user types
- **Interactive Maps** - Visual representation of forest rights data
- **Real-time Updates** - Live data synchronization
- **Responsive UI** - Mobile-first design approach

## 🚀 Deployment

The application is automatically deployed to Netlify when changes are pushed to the main branch.

### Netlify Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x

## 📊 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── data/               # Mock data and constants
└── types/              # TypeScript type definitions
```

## 🎨 Design System

- **Color Scheme**: Professional blue and green palette
- **Typography**: Clean, readable fonts
- **Icons**: Lucide React icon library
- **Layout**: Responsive grid system
- **Components**: Consistent UI component library

## 🔐 Authentication

- **Firebase Authentication** - Primary authentication method
- **Mock Authentication** - Fallback for development without Firebase
- **Role-Based Access** - Government and Local user roles
- **Secure Logout** - Proper session management

## 📈 Features in Detail

### Map Integration
- Interactive map with claim locations
- Filter by state, district, and status
- Click to view detailed claim information
- Real-time data visualization

### Analytics Dashboard
- Total claims statistics
- Approval rates and trends
- Regional performance metrics
- Interactive charts and graphs

### Complaint System
- Submit complaints with priority levels
- Track complaint status
- Government response system
- Email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Victor Raj**
- GitHub: [@Victorraj020](https://github.com/Victorraj020)
- Project: [FRA Portal](https://github.com/Victorraj020/FRA)

## 🙏 Acknowledgments

- Forest Rights Act implementation teams
- Open source community
- React and TypeScript communities
- All contributors and testers

## 📞 Support

For support, email victorraj020@gmail.com or create an issue in the repository.

---

**Built with ❤️ for Forest Rights Administration**