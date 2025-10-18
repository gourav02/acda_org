import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

/**
 * NextAuth Configuration
 * Handles authentication with credentials (username/password)
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please provide both username and password");
        }

        try {
          // Connect to database
          await connectDB();

          // Find admin by username
          const admin = await Admin.findOne({
            username: credentials.username.toLowerCase().trim(),
          }).select("+password");

          // Check if admin exists
          if (!admin) {
            console.log("Admin not found:", credentials.username);
            throw new Error("Invalid username or password");
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.username);
            throw new Error("Invalid username or password");
          }

          // Return user object (will be stored in JWT)
          console.log("✅ Admin authenticated:", admin.username);
          return {
            id: admin._id.toString(),
            name: admin.username,
          };
        } catch (error) {
          console.error("Authentication error:", error);

          // Re-throw the error for NextAuth to handle
          if (error instanceof Error) {
            throw error;
          }

          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Redirect errors to login page
  },

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks
  callbacks: {
    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user }) {
      // Add user info to token on sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    // Session callback - runs when session is checked
    async session({ session, token }) {
      // Add user info to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
};
