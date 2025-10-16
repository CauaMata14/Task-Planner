import React, { useState, useMemo } from 'react';
import TaskList from './TaskList';
import KanbanBoard from './KanbanBoard';
import Calendar from './Calendar';
import TaskModal from './TaskModal';

function Dashboard({ tasks, currentView, onViewChange, onSaveTask, onDeleteTask, onUpdateTaskStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Verificações de segurança para evitar erros com propriedades undefined
      const title = task.title || '';
      const description = task.description || '';
      const tags = task.tags || [];

      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesStatus = !statusFilter || task.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTaskStatus = async (taskData) => {
    try {
      // Find the current task to preserve other data
      const currentTask = tasks.find(task => task.id === taskData.id);
      if (currentTask) {
        await onUpdateTaskStatus({
          ...currentTask,
          status: taskData.status
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      await onSaveTask(taskData);
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await onDeleteTask(taskId);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <main className="main-content">
        {/* Navigation Tabs - Compact Widget Style */}
        <div className="planner-card" style={{
          gridColumn: '1 / -1',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div className="nav-tabs" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '0'
          }}>
            <button
              className={`btn ${currentView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onViewChange('list')}
              style={{
                fontSize: '1rem',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontWeight: '600'
              }}
            >
              📋 Lista
            </button>
            <button
              className={`btn ${currentView === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onViewChange('kanban')}
              style={{
                fontSize: '1rem',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontWeight: '600'
              }}
            >
              📊 Kanban
            </button>
            <button
              className={`btn ${currentView === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onViewChange('calendar')}
              style={{
                fontSize: '1rem',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontWeight: '600'
              }}
            >
              📅 Calendário
            </button>
          </div>
        </div>

        {/* Search and Filters - Compact Layout */}
        <div className="planner-card" style={{
          gridColumn: '1 / -1',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'end',
            flexWrap: 'wrap'
          }}>
            <div className="form-group" style={{
              flex: '1',
              minWidth: '250px',
              marginBottom: '0'
            }}>
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  fontSize: '1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px'
                }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <select
                className="form-input"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  width: 'auto',
                  fontSize: '1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px',
                  minWidth: '150px'
                }}
              >
                <option value="">🎯 Prioridade</option>
                <option value="high">🔴 Alta</option>
                <option value="medium">🟡 Média</option>
                <option value="low">🟢 Baixa</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: 'auto',
                  fontSize: '1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '16px',
                  minWidth: '150px'
                }}
              >
                <option value="">📊 Status</option>
                <option value="todo">📋 A Fazer</option>
                <option value="in-progress">🔄 Em Progresso</option>
                <option value="done">✅ Concluída</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area - Optimized Grid */}
        {currentView === 'list' && (
          <TaskList
            tasks={filteredTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {currentView === 'kanban' && (
          <KanbanBoard
            tasks={filteredTasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {currentView === 'calendar' && (
          <Calendar
            tasks={filteredTasks}
            onEditTask={handleEditTask}
          />
        )}
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          existingTasks={tasks}
        />
      )}
    </>
  );
}

export default Dashboard;
