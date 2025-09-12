# FRA Vista Dashboard

A comprehensive Forest Rights Act (FRA) dashboard for tracking and visualizing forest rights claims across India.

## 🌟 Features

- **Interactive Map**: Real-time visualization of forest rights claims across Indian states
- **State Highlighting**: Special highlighting for key states (Madhya Pradesh, Odisha, Telangana, Tripura)
- **Advanced Filtering**: Filter by state, district, and claim status
- **Data Visualization**: Charts and statistics for claim distribution and trends
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🚀 Live Demo

[Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/Victorraj020/FRA)

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Radix UI** - Accessible component library
- **shadcn/ui** - Beautiful UI components

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Victorraj020/FRA.git

# Navigate to project directory
cd FRA

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Deployment

### Netlify (Recommended)

1. **One-Click Deploy**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Victorraj020/FRA)

2. **Manual Deploy**:
   ```bash
   # Build the project
   npm run build
   
   # Deploy the 'dist' folder to Netlify
   ```

### Other Platforms

- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions for deployment
- **AWS S3**: Upload the `dist` folder to S3

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ControlPanel.tsx # Filter and control panel
│   ├── MapView.tsx     # Interactive map component
│   └── Header.tsx      # Application header
├── data/               # Mock data and types
├── pages/              # Application pages
└── lib/                # Utility functions
```

## 🎯 Key Features

### State Highlighting
The dashboard highlights four key states in red:
- Madhya Pradesh
- Odisha  
- Telangana
- Tripura

### Interactive Map
- Clickable markers for each village
- Status-based color coding
- Detailed popups with village information
- Real-time filtering

### Data Visualization
- Pie charts for claim distribution
- Bar charts for monthly trends
- Statistics cards for key metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Maps powered by [Leaflet](https://leafletjs.com/)
- Charts by [Recharts](https://recharts.org/)
