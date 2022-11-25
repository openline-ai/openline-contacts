import NextAuth, { NextAuthOptions } from "next-auth"
import FusionAuth from "next-auth/providers/fusionauth";

export const authOptions: NextAuthOptions = {
    providers: [
        FusionAuth({
            id: "fusionauth",
            name: "Openline",
            clientId: "454d38a1-ca29-4025-8a51-d1285e61ce27",
            clientSecret: "431y09JipYVNJ0X_687Nr4r2nV5GhBHeUavyyYlUu4I",
            tenantId: "3d8b5ca9-5845-49ca-998a-5f7fd54de41a",
            issuer: "openline.ninja",
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
}

export default NextAuth(authOptions)
