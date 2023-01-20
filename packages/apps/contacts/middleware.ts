import {NextResponse} from "next/server";
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/customer-os-api/') && !request.nextUrl.pathname.startsWith('/sa/') && !request.nextUrl.pathname.startsWith('/fs/')) {
        return NextResponse.next()
    } else {
        var newURL = '';
        const requestHeaders = new Headers(request.headers);

        if (request.nextUrl.pathname.startsWith('/customer-os-api/')) {
            newURL = process.env.CUSTOMER_OS_API_PATH + "/" + request.nextUrl.pathname.substring(("/customer-os-api/").length);
            requestHeaders.set('X-Openline-API-KEY', process.env.CUSTOMER_OS_API_KEY as string)
            // requestHeaders.set('X-Openline-USERNAME', request.nextauth.token?.email as string)
            requestHeaders.set('X-Openline-USERNAME', "dev@openline.ai")
        } else if (request.nextUrl.pathname.startsWith('/fs/')) {
            newURL = process.env.FILE_STORAGE_API_PATH + "/" + request.nextUrl.pathname.substring(("/fs/").length);
            requestHeaders.set('X-Openline-API-KEY', process.env.FILE_STORAGE_API_KEY as string)
        }else if (request.nextUrl.pathname.startsWith('/sa/')) {
            newURL = process.env.SETTINGS_API_PATH + "/" + request.nextUrl.pathname.substring(("/sa/").length);
            requestHeaders.set('X-Openline-API-KEY', process.env.SETTINGS_API_KEY as string)
            // requestHeaders.set('X-Openline-USERNAME', request.nextauth.token?.email as string)
            requestHeaders.set('X-Openline-USERNAME', "dev@openline.ai")
            requestHeaders.set('Content-Type', "application/json")
        }

        if (request.nextUrl.searchParams) {
            newURL = newURL + "?" + request.nextUrl.searchParams.toString()
        }
        console.log("Rewriting url to " + newURL);

        return NextResponse.rewrite(new URL(newURL, request.url),
            {
                request: {
                    headers: requestHeaders,
                },
            }
        )
    }
}

export const config = {
    matcher: ['/customer-os-api/(.*)', '/fs/(.*)', '/sa/(.*)'],
}