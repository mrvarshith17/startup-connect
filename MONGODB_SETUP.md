# VentureLink MongoDB Setup Guide

This guide will help you set up VentureLink with MongoDB database instead of localStorage.

## 🚀 Quick Setup Steps

### 1. **Prerequisites Installation**

#### Install Node.js
- Download from [nodejs.org](https://nodejs.org/) (version 18.x or higher)
- Verify installation: `node --version`

#### Install MongoDB
Choose one of these options:

**Option A: MongoDB Community Server (Recommended)**
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install following the instructions for your OS
3. Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` file with your connection string

### 2. **Project Setup**

1. **Extract the zip file** and open in VS Code
2. **Open Terminal** in VS Code (`Ctrl + \``)
3. **Install all dependencies**:
   ```bash
   npm install
   ```

### 3. **Database Configuration**

The `.env` file is already created with these settings:
```env
MONGODB_URI=mongodb://localhost:27017/venturelink
PORT=8080
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
```

**For MongoDB Atlas (Cloud):**
Update the `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/venturelink
```

### 4. **Start the Application**

1. **Start MongoDB** (if using local installation):
   ```bash
   # Windows
   mongod
   
   # Mac
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Go to `http://localhost:8080`

## 🎯 **What's Different with MongoDB**

### **Data Storage**
- ✅ **Users**: Stored in MongoDB `users` collection
- ✅ **Ideas**: Stored in MongoDB `ideas` collection  
- ✅ **Investments**: Stored in MongoDB `investments` collection
- ✅ **Likes**: Stored in MongoDB `likes` collection
- ✅ **Chats**: Stored in MongoDB `chats` collection

### **Features**
- ✅ **Persistent Data**: Data survives browser/server restarts
- ✅ **Real Database**: Proper database with indexes and relationships
- ✅ **Scalable**: Can handle thousands of users and ideas
- ✅ **Search**: Full database search capabilities
- ✅ **Backup**: Can backup and restore data

## 🛠 **Database Structure**

### **Collections Created:**

1. **users** - User accounts (founders and investors)
2. **ideas** - Startup ideas submitted by founders
3. **investments** - Investment interests from investors
4. **likes** - User likes on ideas
5. **chats** - Chat conversations between users

### **Sample Data:**
The database will automatically create collections when you:
1. Register your first user
2. Submit your first idea
3. Express investment interest
4. Start a chat conversation

## 🧪 **Testing the MongoDB Integration**

### **Verification Steps:**

1. **Register a user** → Check MongoDB for new user document
2. **Submit an idea** → Check MongoDB for new idea document
3. **Express interest** → Check MongoDB for new investment document
4. **Send messages** → Check MongoDB for chat documents

### **MongoDB Compass (GUI Tool)**
1. **Download**: [MongoDB Compass](https://www.mongodb.com/products/compass)
2. **Connect**: `mongodb://localhost:27017`
3. **Select Database**: `venturelink`
4. **View Collections**: See your data in real-time

### **MongoDB Shell Commands**
```bash
# Connect to MongoDB
mongosh

# Switch to venturelink database
use venturelink

# View all collections
show collections

# View users
db.users.find()

# View ideas
db.ideas.find()

# Count documents
db.users.countDocuments()
```

## 🔧 **Troubleshooting**

### **MongoDB Connection Issues**

**Error: "MongoServerError: connect ECONNREFUSED"**
- Solution: Start MongoDB service
- Windows: Run `mongod` in command prompt
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

**Error: "Authentication failed"**
- Solution: Check your MongoDB Atlas credentials
- Verify username/password in connection string

### **Port Issues**

**Error: "Port 27017 already in use"**
- Solution: Stop existing MongoDB process or use different port

**Error: "Port 8080 already in use"**
- Solution: The app will automatically use next available port

### **Installation Issues**

**Error: "npm install fails"**
- Solution: Clear npm cache and retry
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## 📊 **Database Monitoring**

### **View Data in Real-time**
1. **MongoDB Compass**: Visual interface to browse data
2. **MongoDB Shell**: Command-line interface
3. **Application Logs**: Server logs show database operations

### **Performance Monitoring**
- Database operations are logged in the console
- Connection status is displayed on server startup
- Error handling for database failures

## 🚀 **Production Deployment**

### **Environment Variables**
Set these in production:
```env
MONGODB_URI=your-production-mongodb-url
JWT_SECRET=your-super-secure-production-secret
NODE_ENV=production
```

### **MongoDB Atlas Production**
1. Create production cluster
2. Set up proper user permissions
3. Enable network access for your server
4. Use connection string in production environment

## 📞 **Support**

### **Common Commands**
```bash
# Start development with MongoDB
npm run dev

# View database logs
mongod --verbose

# Backup database
mongodump --db venturelink

# Restore database
mongorestore --db venturelink dump/venturelink/
```

### **Helpful Resources**
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Tutorial](https://docs.atlas.mongodb.com/)

---

🎉 **You're now running VentureLink with MongoDB!** 

Your data is stored in a real database and will persist between sessions. You can scale to thousands of users and ideas!
