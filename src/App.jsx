import React, { useState, useEffect } from 'react';
import localAuth from './localAuth';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Loading from './components/Loading';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize local auth service
    localAuth.initialize();

    // Load tasks from localStorage
    loadTasks();
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadTasks = () => {
    // Get demo user (first user created)
    const users = localAuth.getUsers();
    console.log('Users loaded:', users); // Debug: Check if users exist
    const demoUser = users[0];

    if (demoUser) {
      const userTasks = localAuth.getTasks(demoUser.id);
      console.log('Tasks loaded for user:', userTasks); // Debug: Check loaded tasks
      setTasks(userTasks);
    } else {
      console.log('No demo user found'); // Debug: If no user
    }
  };

  const saveTask = async (taskData) => {
    try {
      // Get demo user
      const users = localAuth.getUsers();
      const demoUser = users[0];

      if (demoUser) {
        const taskId = localAuth.saveTask({
          ...taskData,
          userId: demoUser.id
        });

        // Reload tasks
        loadTasks();
        return taskId;
      }
    } catch (error) {
      throw new Error('Erro ao salvar tarefa');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      localAuth.deleteTask(taskId);
      loadTasks();
    } catch (error) {
      throw new Error('Erro ao excluir tarefa');
    }
  };

  const updateTaskStatus = async (taskData) => {
    try {
      await saveTask(taskData);
    } catch (error) {
      throw new Error('Erro ao atualizar tarefa');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="app">
      <Header
        user={{ email: 'Task Planner Local', name: 'Modo Local' }}
        onLogout={() => {}} // No-op for local mode
      />
      <Dashboard
        tasks={tasks}
        setTasks={setTasks}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSaveTask={saveTask}
        onDeleteTask={deleteTask}
        onUpdateTaskStatus={updateTaskStatus}
        isOnline={isOnline}
      />
    </div>
  );
}

export default App;
