import { SignInMethod } from "@/apis/apiService";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface User {
        token: string;
        accessToken: string;
        image: string;
        name: string;
        email: string;
        role: string;
    }

    interface Session {
        user: {
            accessToken: string;
            email: string;
            image: string;
            name: string;
            role: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and Password are required");
                }

                try {
                    const response = await SignInMethod({
                        email: credentials.email,
                        password: credentials.password,
                    });
                    
                    if (response.status === 200 && response.data?.data) {
                         console.log("User authenticated:", response.data.data);
                        return {
                            id: response.data.data?.profile?.user_id, // Assign token as user ID
                            token: response.data.data?.session_id,
                            accessToken: response.data.data.session_id,
                            email: credentials.email,
                            image: response.data.data.profile?.image,
                            name: response.data.data.profile?.name,
                            role: response.data.data.profile?.role,
                        };
                    }

                    throw new Error("Invalid credentials");
                } catch (error: any) {
                    throw new Error(`Authentication failed: ${error.message || "Unknown error"}`);
                }
            },
        }),
    ],

    pages: {
        signIn: "/login", // Redirect to login page on failed authentication
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user }) {
            // Attach user token to JWT on initial login
            if (user) {
                token.accessToken = user.token;
                token.image = user.image;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }
            
            return token;
        },

        async session({ session, token }) {
            // Attach accessToken to session
            if (session.user) {
                session.user.accessToken = token.accessToken as string;
                session.user.image = token.image as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            // Handle relative URLs
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`
            }
            // Handle URLs from the same origin
            else if (new URL(url).origin === baseUrl) {
                return url
            }
            
            return baseUrl
        },
    },

    debug: process.env.NODE_ENV === "development",

    secret: process.env.NEXTAUTH_SECRET || "development-secret", // Ensure secure secret in production
};
