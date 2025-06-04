const API_BASE = 'http://127.0.0.1:8000/api';

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

    async get<T>(url: string, token: null|string) {
        const res = await fetch(`${API_BASE}${url}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json() as Promise<T>;
    },
    async post<T>(url: string, data: any, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Échec de la requête PUT');
        return res.json() as Promise<T>;
    },
    async delete(url: string, token: string) {
        const res = await fetch(`${API_BASE}${url}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Échec de la requête DELETE');
        return res.json();
    }

};
