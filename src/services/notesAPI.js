
import axios from 'axios'

const API_URL = "https://ignpqffzzrgzeoxnwaph.supabase.co/rest/v1/note"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbnBxZmZ6enJnemVveG53YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4OTcyOTIsImV4cCI6MjA5NjQ3MzI5Mn0.bdQq9nSTX6Nw_427QhOsPEgwkETJ1lVrPlHmEpkm1KI"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const notesAPI = {
    async fetchNotes() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    async createNote(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },

     async deleteNote(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    }
}