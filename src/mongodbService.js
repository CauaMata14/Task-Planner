// MongoDB API client for Task Planner
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class MongoDBService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic fetch wrapper with error handling
  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`Erro na API: ${error.message}`);
    }
  }

  // Get all tasks for a user
  async getTasks(userId) {
    return this.fetchAPI(`/tasks/${userId}`);
  }

  // Create new task
  async createTask(taskData) {
    return this.fetchAPI('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Update task
  async updateTask(taskId, taskData) {
    return this.fetchAPI(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Delete task
  async deleteTask(taskId) {
    return this.fetchAPI(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Get all users (for demo purposes)
  async getUsers() {
    return this.fetchAPI('/users');
  }

  // Health check
  async healthCheck() {
    return this.fetchAPI('/health');
  }
}

// Create singleton instance
const mongoDBService = new MongoDBService();

export default mongoDBService;
