import React, { useState } from 'react';

function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Formulário submetido:', { email: formData.email, isLogin });

    try {
      await onAuth(formData.email, formData.password, isLogin);
      console.log('Autenticação bem-sucedida');
    } catch (error) {
      console.error('Erro no componente Auth:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Task Planner</h2>

        {error && (
          <div style={{
            background: 'var(--color-priority-high)',
            color: '#B91C1C',
            padding: '0.75rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{width: '100%', marginBottom: '1rem'}}
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>

          <div style={{textAlign: 'center'}}>
            <button
              type="button"
              className="btn btn-link"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {isLogin ? 'Criar conta' : 'Já tenho conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
