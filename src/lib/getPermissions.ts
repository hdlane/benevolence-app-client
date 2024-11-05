import createApi from "./api";

async function getPermissions() {
    const controller = new AbortController();
    const api = createApi({ endpoint: "/me" });
    const response = await api.get({ controller: controller });
    return response;
}

export default getPermissions;
