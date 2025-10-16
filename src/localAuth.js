// Simple local authentication service using localStorage
// This simulates user accounts and stores data locally

class LocalAuthService {
  constructor() {
    this.USERS_KEY = 'taskplanner_users';
    this.CURRENT_USER_KEY = 'taskplanner_current_user';
    this.TASKS_KEY = 'taskplanner_tasks';
  }

  // Initialize with demo user if no users exist
  initialize() {
    const users = this.getUsers();
    if (users.length === 0) {
      this.createUser('demo@taskplanner.com', 'demo123', 'Demo User');
    }
  }

  // Get all users from localStorage
  getUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Create a new user
  createUser(email, password, name) {
    const users = this.getUsers();

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      throw new Error('auth/email-already-in-use');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      name,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return newUser;
  }

  // Authenticate user
  authenticateUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('auth/user-not-found');
    }

    return user;
  }

  // Get current logged in user
  getCurrentUser() {
    const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!currentUserId) return null;

    const users = this.getUsers();
    return users.find(user => user.id === currentUserId) || null;
  }

  // Set current logged in user
  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, user.id);
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  // Logout user
  logout() {
    this.setCurrentUser(null);
  }

  // Task management methods
  getTasks(userId) {
    const allTasks = this.getAllTasks();
    return allTasks.filter(task => task.userId === userId);
  }

  getAllTasks() {
    const tasks = localStorage.getItem(this.TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  }

  saveTask(taskData) {
    const allTasks = this.getAllTasks();

    if (taskData.id) {
      // Update existing task
      const index = allTasks.findIndex(task => task.id === taskData.id);
      if (index !== -1) {
        allTasks[index] = {
          ...taskData,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      allTasks.push(newTask);
    }

    localStorage.setItem(this.TASKS_KEY, JSON.stringify(allTasks));
    return taskData.id || allTasks[allTasks.length - 1].id;
  }

  deleteTask(taskId) {
    const allTasks = this.getAllTasks();
    const filteredTasks = allTasks.filter(task => task.id !== taskId);
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(filteredTasks));
  }

  // Import/Export functionality
  exportUserData(userId) {
    const userTasks = this.getTasks(userId);
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    return {
      user: { ...user, password: undefined }, // Remove password for security
      tasks: userTasks,
      exportedAt: new Date().toISOString()
    };
  }

  importUserData(data) {
    // This would require careful validation in production
    console.log('Import functionality would be implemented here');
  }
}

// Create singleton instance
const localAuth = new LocalAuthService();

export default localAuth;
