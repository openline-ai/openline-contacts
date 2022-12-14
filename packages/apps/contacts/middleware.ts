import {withAuth, NextRequestWithAuth} from "next-auth/middleware"
import {NextRequest, NextResponse} from "next/server";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware

export default withAuth(function middleware(request: NextRequestWithAuth) {
        if (!request.nextUrl.pathname.startsWith('/customer-os-api/')) {
            return NextResponse.next()
        } else {

            var newURL = '';

            if (request.nextUrl.pathname.startsWith('/customer-os-api/')) {
                newURL = process.env.CUSTOMER_OS_API_PATH + "/" + request.nextUrl.pathname.substring(("/customer-os-api/").length);
            }

            if (request.nextUrl.searchParams) {
                newURL = newURL + "?" + request.nextUrl.searchParams.toString()
            }
            console.log("Rewriting url to " + newURL);

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('X-Openline-APP-KEY', process.env.CUSTOMER_OS_API_KEY as string)

            return NextResponse.rewrite(new URL(newURL, request.url),
                {
                    request: {
                        headers: requestHeaders,
                    },
                }
            )
        }
    },
    {
        callbacks: {
            authorized({req, token}) {
                console.log("Got Token: " + JSON.stringify(token));
                if (token) return true
                return false;
            },
        },
    })

export const config = {
    matcher: ['/customer-os-api/(.*)'],
}