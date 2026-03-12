const VITE_API_BASE: string = import.meta.env.VITE_API_BASE;
const API_BASE = `${VITE_API_BASE}api`;

export const api = {
    async login(email: string, password: string) {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error('Échec de la connexion');
        return res.json();
    },

    async get<T>(url: string, token: null | string) {
        const res = await fetch(`${API_BASE}${url}`, {
            headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
        });
        return res.json() as Promise<T>;
    },
    async post<T>(url: string, data: any, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Échec de la requête POST');
        return res.json() as Promise<T>;
    },
    async put<T>(url: string, data: any, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Échec de la requête PUT');
        return res.json() as Promise<T>;
    },
    async delete(url: string, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}`, 'Accept': 'application/json' },
        });

        if (!res.ok) throw new Error('Échec de la requête DELETE');
        return res.json();
    },


    async postFormData<T>(url: string, formData: FormData, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        if (!res.ok) {
            let bodyText: string;
            try {
                bodyText = await res.text();
            } catch (e) {
                bodyText = '<unable to read response body>';
            }
            const msg = `POST ${url} failed: ${res.status} ${res.statusText} - ${bodyText}`;
            console.error(msg);
            throw new Error(msg);
        }
        return res.json() as Promise<T>;
    },

    async putFormData<T>(url: string, formData: FormData, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        if (!res.ok) {
            let bodyText: string;
            try {
                bodyText = await res.text();
            } catch (e) {
                bodyText = '<unable to read response body>';
            }
            const msg = `PUT ${url} failed: ${res.status} ${res.statusText} - ${bodyText}`;
            console.error(msg);
            throw new Error(msg);
        }
        return res.json() as Promise<T>;
    }

};
