function createApi({ endpoint }) {
    const API_URL = "http://localhost:3000/api/v1";
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
                return response;
            } catch (error) {
                throw error;
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
                return response;
            } catch (error) {
                throw error;
            }
        },
        _delete: async ({ options = {}, controller }) => {
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
                return response;
            } catch (error) {
                throw error;
            }
        },
    }
}

export default createApi;
