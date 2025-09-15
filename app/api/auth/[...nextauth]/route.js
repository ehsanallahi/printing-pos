import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// FIX: Replaced local PrismaClient with the shared instance
import prisma from '@/lib/prisma'; 
// FIX: Changed 'bcrypt' to 'bcryptjs' to match the installed package
import bcrypt from 'bcryptjs'; 

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      // ... inside CredentialsProvider({...})

async authorize(credentials) {
  console.log("Authorize function started. Attempting login for:", credentials.email);

  if (!credentials.email || !credentials.password) {
    console.log("Credentials missing.");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      console.log("User not found in database.");
      return null;
    }
    console.log("User found in database:", user.email);

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.hashedPassword
    );

    if (!isPasswordValid) {
      console.log("Password comparison failed.");
      return null;
    }

    console.log("Password is valid. Login successful.");
    return { id: user.id, email: user.email };

  } catch (error) {
    console.error("CRITICAL ERROR during authorization:", error);
    return null;
  }
},


    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
 pages: {
  signIn: '/login', // MUST be '/login'
},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };