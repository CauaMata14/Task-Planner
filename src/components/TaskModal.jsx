import React, { useState, useEffect } from 'react';

// Utility function to truncate text
const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

function TaskModal({ task, onSave, onClose, existingTasks = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    estimatedTime: '',
    tags: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate ? task.dueDate.slice(0, 16) : '',
        estimatedTime: task.estimatedTime || '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        estimatedTime: '',
        tags: ''
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate titles (excluding current task if editing)
    const isDuplicate = existingTasks.some(existingTask => {
      // Verificações de segurança para evitar erros com propriedades undefined
      const existingTitle = existingTask.title || '';
      const currentTitle = formData.title || '';

      return existingTitle.toLowerCase() === currentTitle.toLowerCase() &&
             (!task || existingTask.id !== task.id);
    });

    if (isDuplicate) {
      alert('Já existe uma tarefa com este título!');
      return;
    }

    const taskData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      ...(task && { id: task.id })
    };

    try {
      await onSave(taskData);
      // Modal será fechado pelo componente pai (Dashboard) após sucesso
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="3"
              style={{resize: 'vertical'}}
            />
          </div>

          <div className="grid">
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select
                className="form-input"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="todo">A Fazer</option>
                <option value="in-progress">Em Progresso</option>
                <option value="done">Concluída</option>
              </select>
            </div>
          </div>

          <div className="grid">
            <div className="form-group">
              <label className="form-label">Data de Vencimento</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tempo Estimado (horas)</label>
              <input
                type="number"
                className="form-input"
                value={formData.estimatedTime}
                onChange={(e) => handleChange('estimatedTime', e.target.value)}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Etiquetas</label>
            <input
              type="text"
              className="form-input"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="trabalho, urgente, projeto-x"
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '1.5rem'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
