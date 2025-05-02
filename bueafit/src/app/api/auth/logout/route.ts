// logout

export async function POST() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BUEAFIT_API}/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("response", response);
        return response;
    }catch(e){
        console.error(e);
    }
}