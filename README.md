# Feez - Full-Stack Next.js Application

A modern full-stack web application built with Next.js, TypeScript, MongoDB, and Tailwind CSS. This project demonstrates both frontend and backend capabilities deployed on a single instance with file-based routing.

## 🚀 Tech Stack

- **Frontend**: Next.js 15.5.3 with React 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod for schema validation
- **API**: Next.js App Router API routes

## 📁 Project Structure

```
feez/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts      # Health check endpoint
│   │   │   └── users/route.ts       # User CRUD operations
│   │   ├── page.tsx                 # Main homepage
│   │   └── layout.tsx               # Root layout
│   ├── lib/
│   │   ├── mongodb.ts               # Database connection
│   │   └── api-utils.ts             # API response utilities
│   ├── models/
│   │   └── User.ts                  # User model schema
│   └── types/
│       └── global.d.ts              # Global type definitions
├── .env.local                       # Environment variables
├── .env.example                     # Environment template
└── package.json                     # Dependencies
```

## 🛠️ Setup & Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /media/k-indunil/New\ Volume/Feez/feez
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and update the values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/feez-db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   # Make sure MongoDB is installed and running
   sudo service mongod start
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check system health and database connection |
| GET | `/api/users` | Fetch all users |
| POST | `/api/users` | Create a new user |

### Example API Usage

**Create a user**:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Get all users**:
```bash
curl http://localhost:3000/api/users
```

**Health check**:
```bash
curl http://localhost:3000/api/health
```

## 🏗️ Features

- ✅ **Full-stack architecture** with frontend and backend on same instance
- ✅ **File-based routing** using Next.js App Router
- ✅ **MongoDB integration** with Mongoose ODM
- ✅ **User management** with password hashing
- ✅ **RESTful API** endpoints
- ✅ **TypeScript** for type safety
- ✅ **Responsive design** with Tailwind CSS
- ✅ **Real-time UI updates** with React state management
- ✅ **Environment configuration** for different stages
- ✅ **Error handling** with proper API responses

## 🧪 Development

**Build for production**:
```bash
npm run build
```

**Start production server**:
```bash
npm start
```

**Lint code**:
```bash
npm run lint
```

## 📝 Environment Variables

Required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXTAUTH_URL` - Application base URL
- `NEXTAUTH_SECRET` - NextAuth secret key

## 🚀 Deployment

This application can be deployed on various platforms:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

Make sure to set up your environment variables in your deployment platform and have a MongoDB instance accessible (MongoDB Atlas for cloud deployment).

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
