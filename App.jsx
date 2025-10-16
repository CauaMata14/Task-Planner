import React, { useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from './firebase-config';

import Header from './components/Header';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Loading from './components/Loading';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth || !db) {
      console.error('Firebase not configured. Please check firebase-config.js');
      setLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && db) {
      loadTasks();
    }
  }, [user]);

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
    if (!user || !db) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    return unsubscribe;
  };

  const handleAuth = async (email, password, isLogin) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw new Error('Erro na autenticação com Google');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  };

  const saveTask = async (taskData) => {
    try {
      if (taskData.id) {
        await updateDoc(doc(db, 'tasks', taskData.id), {
          ...taskData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...taskData,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      throw new Error('Erro ao salvar tarefa');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      throw new Error('Erro ao excluir tarefa');
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found': return 'Usuário não encontrado';
      case 'auth/wrong-password': return 'Senha incorreta';
      case 'auth/email-already-in-use': return 'E-mail já cadastrado';
      case 'auth/weak-password': return 'Senha muito fraca';
      case 'auth/invalid-email': return 'E-mail inválido';
      default: return 'Erro de autenticação';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!auth || !db) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--color-background)',
        color: 'var(--color-text-primary)'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
            Firebase não configurado
          </h2>
          <p>Configure as credenciais do Firebase no arquivo firebase-config.js</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {user ? (
        <>
          <Header
            user={user}
            onLogout={handleLogout}
          />
          <Dashboard
            tasks={tasks}
            currentView={currentView}
            onViewChange={setCurrentView}
            onSaveTask={saveTask}
            onDeleteTask={deleteTask}
            isOnline={isOnline}
          />
        </>
      ) : (
        <Auth
          onAuth={handleAuth}
          onGoogleAuth={handleGoogleAuth}
        />
      )}
    </div>
  );
}

export default App;
