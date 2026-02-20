# VAMCC Church Website

A modern Progressive Web App (PWA) for VAMCC - a Tamil American Catholic community. Built with React, Node.js, and PostgreSQL.

## Features

✨ **Progressive Web App (PWA)**
- Installable on iOS home screen like a native app
- Works offline with service worker caching
- Full-screen app experience
- Responsive design optimized for mobile

👥 **Member Portal**
- User registration and authentication
- Member profile management
- Login/logout functionality
- JWT-based security

📱 **Responsive Design**
- Mobile-first approach
- Works on all devices (mobile, tablet, desktop)
- Beautiful UI with gold and cream color scheme
- Optimized for iOS and Android

🎨 **Custom UI**
- Built-in styled components (no external UI library)
- Smooth animations and transitions
- Professional typography with Google Fonts

💬 **Member Registration Chatbot** *(New)*
- Virtual chatbot with member registration flow
- Duplicate phone number detection
- View and update existing member records
- Upcoming events display
- Stores member data securely in PostgreSQL

## Gallery - Church Website & Chatbot Feature

### Home Page - iOS Welcome Version
![Homepage iOS](./screenshots/01-homepage-ios-welcome.jpg)
Responsive iOS mobile version of the church homepage welcome screen.

### Home Page - Desktop Widescreen
![Homepage Desktop](./screenshots/02-homepage-desktop-widescreen.jpg)
Full widescreen desktop version of the homepage showing complete layout and features.

### Database - pgAdmin Logs
![pgAdmin Logs](./screenshots/03-pgadmin-database-logs.jpg)
PostgreSQL database logs and activity captured in pgAdmin management console.

### Database - Activity Monitor
![Database Activity](./screenshots/04-database-activity.jpg)
Real-time database activity and query monitoring dashboard.

### Chatbot - Menu Options
![Chatbot Menu](./screenshots/05-chatbot-menu-options.jpg)
Virtual chatbot interface displaying two main options: member registration and upcoming events.

### Chatbot - Member Registration Form
![Member Registration](./screenshots/06-member-registration-form.jpg)
Chatbot member registration form collecting full name, phone, email, date of birth, and parish information.

### Chatbot - Upcoming Events
![Events Display](./screenshots/07-upcoming-events.jpg)
Chatbot showing list of 10 upcoming church events with dates, times, and descriptions.

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Create React App** - Build tooling
- **ServiceWorker** - Offline functionality
- **PWA Manifest** - App configuration

### Backend
- **Node.js + Express.js** - REST API server
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## Project Structure

```
church-website/
├── frontend/
│   ├── public/
│   │   ├── index.html          # Main HTML
│   │   ├── manifest.json       # PWA manifest
│   │   ├── service-worker.js   # Service worker for offline
│   │   └── icons/              # App icons (SVG)
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   └── index.js            # React entry point
│   └── package.json
│
├── backend/
│   ├── server.js               # Express server
│   ├── .env                    # Environment variables
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Local Development

**1. Setup Backend**
```bash
cd backend
npm install
# Create .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=church_db
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# JWT_SECRET=your_secret_key
npm start
```

Backend runs on `http://localhost:4000`

**2. Setup Frontend**
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

**3. Create Database**
```bash
createdb church_db
```

The backend will auto-create tables on first run.

## Deployment

### Frontend Deployment (GitHub Pages)

```bash
cd frontend
npm install --save-dev gh-pages
npm run deploy
```

Deployed at: `https://ngrifk98.github.io/vamcc-church-website/`

### Backend Deployment (Railway)

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your_secret_key`
   - `FRONTEND_URL=https://your-frontend-url`
5. Deploy

### Domain Configuration

1. Purchase www.vamcc.org from registrar
2. Update DNS CNAME record to point to GitHub Pages
3. Enable custom domain in GitHub Pages settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new member
- `POST /api/auth/login` - Login member

### Member Profile
- `GET /api/members/me` - Get current member profile
- `PUT /api/members/:id` - Update member profile
- `GET /api/members` - List all members (admin only)

### Member Registration Chatbot *(New)*
- `POST /api/members/register` - Register new member via chatbot with duplicate detection
- `GET /api/members/by-phone` - Get member by country code + phone number
- `PUT /api/members/:memberID` - Update existing member record
- `GET /api/events` - Get upcoming church events (10 max)

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```

## Features & Pages

**Home Page**
- Hero section with church image
- Service times (Saturday Mass details)
- Church programs and ministries
- Member portal access

**Registration Page**
- Create new member account
- Input validation
- Error handling

**Login Page**
- Secure member login
- JWT token generation
- Session management

**Profile Page**
- View member information
- Edit profile details
- Member since date
- Role badge

## PWA Features

### Installation
1. On iOS: Safari → Share → Add to Home Screen
2. On Android/Chrome: Install app prompt
3. App opens in full-screen standalone mode

### Offline Support
- Service worker caches static assets
- API calls cached with smart strategies
- Works offline with cached data
- Auto-syncs when back online

## Building for Production

```bash
# Frontend
cd frontend
npm run build

# Creates optimized build in frontend/build folder
# Ready for GitHub Pages deployment
```

## Testing

### Local PWA Testing
```bash
# Build and serve locally
npm run build
npx serve -s build
```

Then visit `http://localhost:3000` and test:
- Add to home screen
- Offline functionality
- Navigation
- Authentication

## Troubleshooting

**Service Worker not updating?**
- Clear browser cache (Ctrl+Shift+R)
- Unregister service workers in DevTools
- Clear site data

**API not connecting?**
- Verify backend is running
- Check CORS settings in backend
- Update `REACT_APP_API_URL` in .env

**PostgreSQL connection error?**
- Ensure PostgreSQL is running
- Check DB credentials in .env
- Database should be pre-created

## Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Create a pull request

## License

This project is for VAMCC. All rights reserved.

## Contact

For questions or support, reach out to the development team.

---

**Live Site:** www.vamcc.org (coming soon)
**Repository:** https://github.com/ngrifk98/vamcc-church-website
