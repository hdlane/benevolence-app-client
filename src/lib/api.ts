function createApi({ endpoint, navigate, toast }) {
    const API_URL = "http://localhost:3000/api/v1";

    async function parseResponse(response) {
        try {
            const json = await response.json();
            if (response.status == 400) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `Error ${response.status}: ${json.message} || ${response.statusText}`,
                })
                navigate("/");
            } else if (response.status == 401) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `Error ${response.status}: ${json.message} || ${response.statusText}`,
                })
                navigate("/login");
            } else if (response.status == 403) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `Error ${response.status}: ${json.message} || ${response.statusText}`,
                })
                navigate("/");
            }
            else if (response.status == 404) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `Error ${response.status}: ${json.message} || ${response.statusText}`,
                })
                navigate("/");
            }
            else if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `Error ${response.status}: ${json.message} || ${response.statusText}`,
                })
            } else {
                toast({
                    title: "Success!",
                    description: `NOICE! ${response.status}: ${json.message} || ${response.statusText}`,
                })
                return json;
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "An Error Occurred",
                description: `${(error as Error).message}`,
            })
        }
    }

    return {
        get: async ({ options = {}, controller }) => {
            try {
                const response = await fetch(
                    `${API_URL}${endpoint}`,
                    {
                        ...options,
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    },
                );
                return await parseResponse(response);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `${(error as Error).message}`,
                })
            }
        },
        post: async ({ body, options = {}, controller }) => {
            try {
                const response = await fetch(
                    `${API_URL}${endpoint}`,
                    {
                        ...options,
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    },
                );
                return await parseResponse(response);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `${(error as Error).message}`,
                })
            }
        },
        delete: async ({ options = {}, controller }) => {
            try {
                const response = await fetch(
                    `${API_URL}${endpoint}`,
                    {
                        ...options,
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    },
                );
                return await parseResponse(response);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "An Error Occurred",
                    description: `${(error as Error).message}`,
                })
            }
        },
    }
}

export default createApi;
