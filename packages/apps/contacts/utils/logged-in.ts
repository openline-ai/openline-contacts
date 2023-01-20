
export async function loggedInOrRedirectToLogin(session: any) {
    // if (!session) {
    //     return {
    //         redirect: {
    //             destination: '/api/auth/signin',
    //             permanent: false,
    //         },
    //     }
    // }

    return {
        props: { session }
    }
}