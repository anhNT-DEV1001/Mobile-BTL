export const key = {
    apiUrl: String(process.env.EXPO_PUBLIC_API_URL),
    apiHost: String(process.env.EXPO_PUBLIC_API_HOST),
    apiPort: String(process.env.EXPO_PUBLIC_API_PORT)
}
export const API_URL =  `http://${key.apiHost}:${key.apiPort}/api/v1`;