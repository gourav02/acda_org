# HealthCare - Next.js 14 Medical Application

A modern, professional healthcare application built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** with strict mode enabled
- **Tailwind CSS** with custom medical/healthcare theme colors
- **shadcn/ui** components for beautiful UI
- **Responsive Design** with mobile-first approach
- **Form Validation** with react-hook-form and Zod
- **Image Handling** with next-cloudinary
- **Icons** from lucide-react
- **ESLint & Prettier** for code quality

## 🎨 Theme Colors

- **Primary**: Dark Blue (#1e3a8a)
- **Secondary**: White (#ffffff)
- **Accent**: Teal (#14b8a6)

## 📁 Project Structure

```
├── app/                  # Next.js app directory (pages and layouts)
├── components/           # Reusable React components
│   ├── ui/              # shadcn/ui components
│   ├── Header.tsx       # Navigation header
│   └── Footer.tsx       # Footer component
├── lib/                 # Utility functions
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
│   └── index.ts         # Common types
├── public/              # Static assets
└── tailwind.config.ts   # Tailwind CSS configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your actual values:
   - **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) for image handling
   - **Resend**: Get API key from [resend.com](https://resend.com) for email services
   - **Admin Email**: Your admin contact email
   - **Site URL**: Your site URL (use `http://localhost:3000` for development)

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Environment Variables

The project uses the following environment variables (see `.env.example`):

### Cloudinary (Image Handling)

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name (public)
- `CLOUDINARY_API_KEY` - Cloudinary API key (server-only)
- `CLOUDINARY_API_SECRET` - Cloudinary API secret (server-only)

### Email (Resend)

- `RESEND_API_KEY` - Resend API key for sending emails (server-only)
- `ADMIN_EMAIL` - Admin email address for notifications (server-only)

### Site Configuration

- `NEXT_PUBLIC_SITE_URL` - Your site URL (public)

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All other variables are server-side only.

Type-safe access to environment variables is available via `lib/env.ts`.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🧰 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: react-hook-form
- **Validation**: Zod
- **Icons**: lucide-react
- **Image Handling**: next-cloudinary

## 📦 Key Dependencies

- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `react-hook-form` - Form management
- `zod` - Schema validation
- `next-cloudinary` - Image optimization

## 🎯 Development

The project follows best practices:

- **TypeScript strict mode** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Component-based architecture**
- **Responsive design patterns**
- **Accessible UI components**

## 📄 License

This project is private and proprietary.
