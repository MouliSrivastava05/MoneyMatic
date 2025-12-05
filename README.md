# MoneyMatic 

A modern, intuitive personal finance management application built with React, Node.js, Express, and MySQL. MoneyMatic helps you track expenses, manage budgets, and keep your finances organized in one calm, approachable place.

##  Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Dashboard**: See your complete financial snapshot at a glance
- **Expense Tracking**: Track and categorize your spending
- **Budget Management**: Set limits and monitor spending habits
- **Responsive Design**: Beautiful UI optimized for desktop and mobile
- **Privacy First**: Data encryption and export controls in your hands
- **Shared Spaces**: Invite family or teammates with role-based permissions

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **PostCSS** - CSS transformation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - ORM for database management
- **MySQL** - Database
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

##  Project Structure

```
MoneyMatic/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js  # Main dashboard
│   │   │   ├── Login.js      # Login page
│   │   │   └── Signup.js     # Signup page
│   │   ├── utils/
│   │   │   └── api.js        # Axios API instance
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Global styles
│   │   └── index.js          # React entry point
│   ├── public/               # Static files
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                    # Express backend
│   ├── index.js              # Main server file
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── client.js         # Prisma client instance
│   ├── package.json
│   └── .env                  # Environment variables
├── package.json              # Root package config
└── tailwind.config.js        # Tailwind config

```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm 
- MySQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MouliSrivastava05/MoneyMatic.git
   cd MoneyMatic
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/moneymatic_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NODE_ENV="development"
   PORT=5000
   ```

   Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the `client` directory (if needed):
   ```env
   REACT_APP_API_URL="http://localhost:5000"
   ```

### Running the Application

1. **Start the backend server** (from `server` directory)
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend** (from `client` directory in a new terminal)
   ```bash
   npm start
   ```
   App will open at `http://localhost:3000`

##  Authentication Flow

### How JWT Works in MoneyMatic

1. **Signup**
   - User creates account with name, email, and password
   - Password is hashed using bcryptjs
   - User is stored in MySQL database
   - JWT token is generated and returned
   - Token and user info are stored in browser localStorage

2. **Login**
   - User enters email and password
   - Backend validates credentials against database
   - JWT token is generated and returned
   - Token is stored in localStorage for future requests

3. **API Requests**
   - JWT token is attached to all API requests in the Authorization header
   - Backend validates token on each request
   - Invalid or expired tokens trigger re-login

4. **Logout**
   - Token and user data are removed from localStorage
   - User is redirected to login page

### Storage Location
- **Token**: Stored in browser `localStorage` with key `"token"`
- **User Data**: Stored in browser `localStorage` with key `"user"`

##  Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(100)
  password  String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

##  API Endpoints

### Authentication

**POST** `/api/auth/signup`
- Request: `{ name, email, password }`
- Response: `{ token, user: { id, name, email } }`

**POST** `/api/auth/login`
- Request: `{ email, password }`
- Response: `{ token, user: { id, name, email } }`

##  Security Features

-  Password hashing with bcryptjs
-  JWT-based stateless authentication
-  CORS protection
-  Environment variable management
-  Input validation
-  Unique email constraint in database

##  Troubleshooting

### "Database connection failed"
- Ensure MySQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists: `moneymatic_db`
- Run: `npx prisma migrate dev`

### "JWT_SECRET not set"
- Add `JWT_SECRET` to `.env` file in server directory
- Use a strong, random string (minimum 32 characters)

### "CORS error"
- Backend CORS is enabled by default
- Ensure frontend URL matches backend origin

### "Token not stored after login"
- Check browser DevTools → Application → Local Storage
- Verify signup/login response contains `token`
- Check browser console for API errors

##  Build & Deployment

### Build Frontend
```bash
cd client
npm run build
```
Creates optimized production build in `client/build/`

### Deployment Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, AWS, DigitalOcean
- **Database**: Aiven MySQL, AWS RDS, DigitalOcean MySQL

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Author

**Mouli Srivastava**
- GitHub: [@MouliSrivastava05](https://github.com/MouliSrivastava05)

##  Acknowledgments

- Tailwind CSS for beautiful, utility-first styling
- Prisma for database ORM
- Express.js community for excellent documentation
- React for the amazing UI library

---

**MoneyMatic** - Keep finance simple, steady, and in your control.
