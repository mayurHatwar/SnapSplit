# SnapSplit - AI-Powered Photo Sorting & Sharing App

SnapSplit is an intelligent photo sharing application that uses AI face detection to automatically sort and distribute group photos to the right people. Perfect for events, trips, and gatherings where multiple people take photos.

## 🚀 Features

- **Smart Face Detection**: AI-powered face recognition to identify people in photos
- **Automatic Photo Sorting**: Distributes photos to users based on who appears in them
- **Album Management**: Create shared albums and invite friends
- **Secure Authentication**: Google/Facebook login integration
- **Real-time Notifications**: Get notified when new photos are available
- **Bulk Operations**: Upload multiple photos at once
- **Privacy First**: Users only see photos they appear in

## 🏗️ Project Structure

\`\`\`
snapsplit/
├── README.md                 # Main documentation
├── DEPLOYMENT.md            # Deployment guide
├── API_DOCUMENTATION.md     # API endpoints documentation
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # User dashboard
│   ├── albums/             # Album management
│   └── api/                # API routes
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── photos/            # Photo-related components
│   └── albums/            # Album components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── face-detection.ts # AI face detection
│   ├── storage.ts        # File storage utilities
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── types/               # TypeScript type definitions
└── public/             # Static assets
\`\`\`

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - Database and authentication
- **Vercel Blob** - File storage

### AI/ML
- **Face-api.js** - Browser-based face detection
- **TensorFlow.js** - Machine learning models

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/snapsplit.git
cd snapsplit
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables in `.env.local`:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

1. **Sign Up/Login**: Create an account or login with Google/Facebook
2. **Upload Profile Photo**: Add a clear selfie for face recognition
3. **Create Album**: Start a new shared album for your event
4. **Invite Friends**: Share the album link with participants
5. **Upload Photos**: Add group photos to the album
6. **AI Processing**: The app automatically detects faces and sorts photos
7. **Access Your Photos**: View and download only photos you appear in

## 🔧 Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## 🚀 Deployment

This app is optimized for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/snapsplit)

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Face-api.js for browser-based face detection
- Supabase for backend infrastructure
- Vercel for hosting and deployment
- shadcn/ui for beautiful components

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: your-email@example.com

---

Built with ❤️ using Next.js, Supabase, and AI
