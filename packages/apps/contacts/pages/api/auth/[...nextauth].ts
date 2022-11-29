import NextAuth, { NextAuthOptions } from "next-auth"
import FusionAuth from "next-auth/providers/fusionauth";

export const authOptions: NextAuthOptions = {
    providers: [
        FusionAuth({
            id: "fusionauth",
            name: "Openline",
            clientId: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            tenantId: process.env.TENANT_ID,
            issuer: "https://auth.openline.ninja",
            client: {
                authorization_signed_response_alg: 'HS256',
                id_token_signed_response_alg: 'HS256'
            }
        }),
    ],
    theme: {
        colorScheme: "dark",
    },
    callbacks: {
        async jwt({ token }: any) {
            token.userRole = "admin"
            return token
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
