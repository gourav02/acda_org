import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export handler for both GET and POST requests
export { handler as GET, handler as POST };
