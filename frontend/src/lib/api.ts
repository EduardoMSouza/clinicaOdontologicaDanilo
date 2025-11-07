// src/lib/api.ts
import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
})

// ✅ Interceptador opcional para depuração
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Erro na requisição API:", error.response || error.message)
        return Promise.reject(error)
    }
)

export default api
