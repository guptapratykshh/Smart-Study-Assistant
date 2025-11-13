# 🎓 Smart Study Assistant

An AI-powered web application that generates personalized study materials including summaries, quizzes, and study tips from any topic using Wikipedia and AI APIs.

![Smart Study Assistant](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## 📋 Overview

Smart Study Assistant is a full-stack educational tool that helps students learn any topic efficiently. Simply enter a topic, and the app will:

- **Fetch** relevant information from Wikipedia
- **Generate** a concise 3-point summary using AI
- **Create** 3 multiple-choice quiz questions (or 1 math problem in math mode)
- **Provide** a practical study tip

### Key Features

- ✅ **Wikipedia Integration**: Fetches real-time data from Wikipedia API
- ✅ **AI-Powered Content**: Uses HuggingFace, Google Gemini, or OpenAI to generate study materials
- ✅ **Math Mode**: Solve quantitative/logic problems with step-by-step explanations
- ✅ **User Authentication**: Firebase-based login/signup with study history tracking
- ✅ **Dark Mode**: Beautiful light/dark theme toggle
- ✅ **Study History**: Track and revisit past topics (stored in MongoDB/Firestore)
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Firebase account (for authentication)
- At least one AI API key (HuggingFace, Gemini, or OpenAI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-study-assistant
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your API keys and MongoDB URI
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your Firebase config
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open in Browser**
   - Frontend: http://localhost:3001
   - Backend API: https://smart-study-assistant-1.onrender.com (deployed)

## 📁 Project Structure

```
smart-study-assistant/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Firebase config
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── services/         # AI & Wikipedia services
│   │   └── server.js         # Express server
│   ├── .env.example          # Environment variables template
│   └── package.json
├── frontend/
│   ├── components/           # React components
│   ├── pages/                # Next.js pages
│   ├── styles/               # CSS styles
│   ├── lib/                  # Firebase config
│   ├── .env.example          # Environment variables template
│   └── package.json
└── README.md
```

## 🔌 API Details

### Main Endpoint

**GET** `/study?topic=<topic>&mode=<normal|math>`

#### Parameters

- `topic` (required): The study topic (e.g., "Python", "Photosynthesis", "2 + 5")
- `mode` (optional): `normal` (default) or `math`

#### Response Format

**Normal Mode:**
```json
{
  "success": true,
  "topic": "Python",
  "mode": "normal",
  "timestamp": "2024-11-13T10:30:00.000Z",
  "source": "https://en.wikipedia.org/wiki/Python",
  "summary": [
    "Bullet point 1",
    "Bullet point 2",
    "Bullet point 3"
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A",
      "explanation": "Explanation text"
    }
    // ... 2 more questions
  ],
  "studyTip": "Study tip text"
}
```

**Math Mode:**
```json
{
  "success": true,
  "topic": "2 + 5",
  "mode": "math",
  "timestamp": "2024-11-13T10:30:00.000Z",
  "source": null,
  "summary": [
    "The expression evaluates to 7",
    "Mathematical expressions follow PEMDAS",
    "Basic arithmetic is fundamental"
  ],
  "mathQuestion": {
    "question": "What is the result of: 2 + 5?",
    "answer": "7",
    "explanation": "2 + 5 = 7. Adding 2 and 5 gives us 7."
  },
  "studyTip": "Practice mental math regularly..."
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": true,
  "message": "Topic parameter is required"
}
```

**500 Internal Server Error:**
```json
{
  "error": true,
  "message": "Failed to generate study materials",
  "details": "Error details"
}
```

### Other Endpoints

- **GET** `/health` - Health check
- **POST** `/api/auth/signup` - User registration
- **POST** `/api/auth/login` - User login
- **GET** `/api/history` - Get study history
- **DELETE** `/api/history` - Clear history
- **DELETE** `/api/history/:id` - Delete specific history item

## 💡 Prompt Examples

### Normal Mode Examples

1. **Simple Topic:**
   ```
   GET /study?topic=Python&mode=normal
   ```

2. **Question Format:**
   ```
   GET /study?topic=What%20is%20Machine%20Learning?&mode=normal
   ```

3. **Complex Topic:**
   ```
   GET /study?topic=Quantum%20Computing&mode=normal
   ```

### Math Mode Examples

1. **Simple Expression:**
   ```
   GET /study?topic=2+5&mode=math
   ```

2. **Complex Expression:**
   ```
   GET /study?topic=(10+5)/3&mode=math
   ```

3. **Algorithmic Complexity:**
   ```
   GET /study?topic=You%20have%20an%20array%20of%201000%20numbers.%20If%20you%20use%20linear%20search,%20what%20is%20the%20worst-case%20time%20complexity?&mode=math
   ```

4. **Calculation Problem:**
   ```
   GET /study?topic=Calculate%20the%20derivative%20of%20x%5E2%20%2B%203x&mode=math
   ```

## 🌐 Hosted URLs

### Production Deployment

- **Frontend (Vercel):** [https://smart-study-assistant-smc5.vercel.app](https://smart-study-assistant-smc5.vercel.app)
- **Frontend (Netlify):** [https://smart-study-assistantt.netlify.app](https://smart-study-assistantt.netlify.app)
- **Backend (Render):** [https://smart-study-assistant-1.onrender.com](https://smart-study-assistant-1.onrender.com)

### Development

- **Frontend:** https://smart-study-assistantt.netlify.app (deployed) http://localhost:3001 (local)
- **Backend:** https://smart-study-assistant-1.onrender.com (deployed) or http://localhost:4000 (local)

## 🧪 Testing

### Manual Test Plan

#### Test Case 1: Normal Mode - Simple Topic
1. Navigate to http://localhost:3001
2. Enter topic: "Python"
3. Ensure Math Mode is unchecked
4. Click "Generate Study Materials"
5. **Expected:**
   - Loading spinner appears
   - Summary with 3 bullet points about Python
   - Quiz with 3 MCQs about Python
   - Study tip displayed
   - Source link to Wikipedia

#### Test Case 2: Math Mode - Simple Expression
1. Navigate to http://localhost:3001
2. Enter topic: "2 + 5"
3. Check Math Mode toggle
4. Click "Generate Study Materials"
5. **Expected:**
   - Summary about the expression
   - Math question: "What is the result of: 2 + 5?"
   - Answer: "7"
   - Step-by-step explanation
   - Study tip about arithmetic

#### Test Case 3: Math Mode - Complex Problem
1. Navigate to http://localhost:3001
2. Enter topic: "You have an array of 1000 numbers. If you use linear search, what is the worst-case time complexity?"
3. Check Math Mode toggle
4. Click "Generate Study Materials"
5. **Expected:**
   - Summary about time complexity
   - Math question with the problem
   - Answer: "O(n)" or "O(1000)"
   - Detailed explanation of Big O notation
   - Study tip about algorithmic complexity

#### Test Case 4: Error Handling
1. Stop the backend server
2. Try to generate study materials
3. **Expected:**
   - Error message displayed
   - Helpful tip to start backend
   - No crash or blank screen

#### Test Case 5: History Functionality
1. Generate study materials for multiple topics
2. Check "Recent Topics" section
3. Click on a history item
4. **Expected:**
   - History items appear with timestamps
   - Clicking re-searches that topic
   - Delete button removes individual items
   - Clear History removes all items

### Backend Test Cases

#### Test Case 1: Valid Request - Normal Mode
```bash
curl "https://smart-study-assistant-1.onrender.com/study?topic=Python&mode=normal"
```
**Expected:** 200 OK with JSON containing summary, quiz, and studyTip

#### Test Case 2: Valid Request - Math Mode
```bash
curl "https://smart-study-assistant-1.onrender.com/study?topic=2+5&mode=math"
```
**Expected:** 200 OK with JSON containing summary, mathQuestion, and studyTip

#### Test Case 3: Missing Topic Parameter
```bash
curl "https://smart-study-assistant-1.onrender.com/study?mode=normal"
```
**Expected:** 400 Bad Request with error message

#### Test Case 4: Invalid Mode
```bash
curl "https://smart-study-assistant-1.onrender.com/study?topic=Python&mode=invalid"
```
**Expected:** 400 Bad Request with error message

#### Test Case 5: Health Check
```bash
curl "https://smart-study-assistant-1.onrender.com/health"
```
**Expected:** 200 OK with `{"status": "healthy", "timestamp": "..."}`

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=4000  # Render will set this automatically
NODE_ENV=production  # Use 'development' for local dev
FRONTEND_URL=http://localhost:3001  # Optional, CORS auto-configures for deployments

# AI APIs (at least one required)
HUGGINGFACE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Database
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Firebase (for authentication)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_ID=your_client_id
```

**Note:** The backend automatically allows CORS from:
- `https://smart-study-assistant-smc5.vercel.app` (Vercel)
- `https://smart-study-assistantt.netlify.app` (Netlify)
- `http://localhost:3001` and `http://localhost:3000` (local dev)
- Any localhost origin (for development)

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://smart-study-assistant-1.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🤖 AI Tools Used

This project uses the following AI services and tools:

### AI APIs
- **HuggingFace Inference API** - Primary AI provider (free tier)
- **Google Gemini API** - Secondary AI provider (free tier)

### AI Models
- HuggingFace: `google/flan-t5-large`, `gpt2`, `distilgpt2`
- Google Gemini: `gemini-2.0-flash-exp`

### AI Usage
- **Content Generation**: Summaries, quiz questions, study tips
- **Problem Solving**: Math expressions, algorithmic complexity questions
- **Context Understanding**: Processing Wikipedia content for relevant study materials

### Disclosure
- AI is used to generate educational content based on Wikipedia data
- All AI-generated content is clearly marked and sourced
- Wikipedia data is fetched from public APIs
- User data is stored securely in MongoDB/Firestore

## 📚 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Firebase Admin SDK** - Authentication and Firestore
- **Axios** - HTTP client
- **JWT** - Authentication tokens

### Frontend
- **Next.js 14.2.0** - React framework
- **React 18.3.1** - UI library
- **Firebase Client SDK** - Authentication
- **CSS3** - Styling with animations and theme support

### APIs & Services
- **Wikipedia MediaWiki API** - Content source
- **HuggingFace Inference API** - AI generation
- **Google Gemini API** - AI generation
- **OpenAI API** - AI generation

## 🚀 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev`
   - **Environment:** Node.js 18+
4. Add environment variables from `.env.example`
5. Deploy!

### Frontend Deployment

#### Vercel
1. Import your GitHub repository
2. Framework Preset: **Next.js** (auto-detected)
3. Root Directory: `frontend`
4. Build Command: `npm run dev`
5. Add environment variables (Firebase config, API URL)
6. Deploy!

#### Netlify
1. Import your GitHub repository
2. Base Directory: `frontend`
3. Build Command: `npm run build`
4. Publish Directory: `.next`
5. Add environment variables
6. Deploy!

**Note:** Both Vercel and Netlify deployments are automatically configured in the backend CORS settings.

## 🔒 CORS Configuration

The backend supports multiple frontend origins:
- Vercel: `https://smart-study-assistant-smc5.vercel.app`
- Netlify: `https://smart-study-assistantt.netlify.app`
- Local development: `http://localhost:3001`, `http://localhost:3000`
- Any localhost origin (for development flexibility)

CORS is automatically configured - no additional setup needed!

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.
