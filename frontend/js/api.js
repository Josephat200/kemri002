// API Client
const API_BASE_URL = (window.location.port === '8080' || window.location.port === '5173')
    ? 'http://localhost:3000/api/v1'
    : '/api/v1';

class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.set(key, String(value));
            }
        });
        return url.toString();
    }

    async request(endpoint, options = {}) {
        const { params, ...requestOptions } = options;
        const url = this.buildUrl(endpoint, params || {});

        const headers = {
            'Content-Type': 'application/json',
            ...(requestOptions.headers || {}),
        };

        const config = {
            ...requestOptions,
            headers,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    // Use default error message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { method: 'GET', ...options });
    }

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
}

const apiClient = new ApiClient(API_BASE_URL);

// Respondent API Methods
const RespondentAPI = {
    async getAll(page = 1, limit = 50) {
        const response = await apiClient.get('/respondents', { params: { page, limit } });
        return response.data || { respondents: [], pagination: { page, limit, total: 0, pages: 0 } };
    },

    async getById(id) {
        const response = await apiClient.get(`/respondents/${id}`);
        return response.data;
    },

    async create(data) {
        const response = await apiClient.post('/respondents', data);
        return response.data;
    },

    async update(id, data) {
        const response = await apiClient.put(`/respondents/${id}`, data);
        return response.data;
    },

    async delete(id) {
        await apiClient.delete(`/respondents/${id}`);
        return true;
    },

    async getStats() {
        const response = await apiClient.get('/respondents/stats/summary');
        return response.data || { totalRespondents: 0, bySchool: {}, byAge: {}, rhInfoAdequacy: {} };
    },

    async downloadExcelExport() {
        const url = apiClient.buildUrl('/respondents/export/excel');
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `respondents-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
        anchor.target = '_self';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    },
};
