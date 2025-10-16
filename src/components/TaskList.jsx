import React from 'react';
import { truncateText, formatDate, getPriorityBadge } from '../utils';

function TaskList({ tasks, onAddTask, onEditTask, onDeleteTask, onUpdateTaskStatus }) {

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await onUpdateTaskStatus({ id: taskId, status: newStatus });
    } catch (error) {
      alert(error.message);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="planner-card">
        <div className="card-title">Minhas Tarefas</div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <span style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            fontWeight: '500'
          }}>
            Nenhuma tarefa encontrada
          </span>
          <button className="btn btn-primary" onClick={onAddTask}>
            ➕ Nova Tarefa
          </button>
        </div>
        <div style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          padding: '3rem 1rem',
          background: 'rgba(247, 191, 216, 0.05)',
          borderRadius: '12px',
          border: '2px dashed var(--color-border)'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: '0.5'
          }}>
            📋
          </div>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Lista vazia
          </p>
          <p style={{
            fontSize: '0.9rem',
            opacity: '0.7'
          }}>
            Crie sua primeira tarefa para começar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-card">
      <div className="card-title">Minhas Tarefas</div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '3px solid var(--color-border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: 'var(--color-text-primary)'
          }}>
            {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''}
          </span>
          <span style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            background: 'rgba(247, 191, 216, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontWeight: '500'
          }}>
            encontradas
          </span>
        </div>
        <button
          className="btn btn-primary"
          onClick={onAddTask}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1rem',
            padding: '1rem 1.5rem'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>➕</span>
          Nova Tarefa
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        maxHeight: '600px',
        overflowY: 'auto',
        paddingRight: '1rem'
      }}>
        <style>
          {`
            .task-grid-container::-webkit-scrollbar {
              width: 8px;
            }
            .task-grid-container::-webkit-scrollbar-track {
              background: rgba(247, 191, 216, 0.1);
              border-radius: 8px;
            }
            .task-grid-container::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, var(--color-accent) 0%, #f7bfd8 100%);
              border-radius: 8px;
            }
            .task-grid-container::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #f7bfd8 0%, var(--color-accent) 100%);
            }
          `}
        </style>
        <div className="task-grid-container">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="task-item"
              style={{
                position: 'relative',
                background: 'var(--color-surface)',
                border: '2px solid var(--color-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideInUp 0.4s ease-out ${index * 0.1}s both`,
                overflow: 'hidden',
                height: 'fit-content'
              }}
            >
              {/* Barra lateral colorida baseada na prioridade */}
              <div style={{
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '6px',
                background: task.priority === 'high'
                  ? 'linear-gradient(180deg, #B91C3C 0%, #B91C3C 100%)'
                  : task.priority === 'medium'
                  ? 'linear-gradient(180deg, #B4536B 0%, #B4536B 100%)'
                  : 'linear-gradient(180deg, #B485A3 0%, #B485A3 100%)',
                borderRadius: '0 6px 6px 0'
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.5rem',
                marginLeft: '1.5rem',
                width: '100%'
              }}>
                {/* Checkbox personalizado */}
                <div style={{
                  flexShrink: '0',
                  marginTop: '0.3rem'
                }}>
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.status === 'done'}
                    onChange={(e) => handleStatusChange(task.id, e.target.checked ? 'done' : 'todo')}
                    style={{
                      width: '22px',
                      height: '22px',
                      border: '3px solid var(--color-border)',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      appearance: 'none',
                      background: task.status === 'done'
                        ? 'linear-gradient(135deg, var(--color-accent) 0%, #f7bfd8 100%)'
                        : 'var(--color-surface)',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: task.status === 'done'
                        ? '0 0 0 4px rgba(247, 191, 216, 0.2)'
                        : 'none'
                    }}
                  />
                  {task.status === 'done' && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      pointerEvents: 'none'
                    }}>
                      ✓
                    </div>
                  )}
                </div>

                {/* Conteúdo da tarefa */}
                <div className="task-content" style={{
                  flex: '1',
                  minWidth: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div
                    className={`task-title ${task.status === 'done' ? 'completed' : ''}`}
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      marginBottom: '0',
                      lineHeight: '1.3',
                      color: task.status === 'done'
                        ? 'var(--color-text-secondary)'
                        : 'var(--color-text-primary)',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {task.title}
                  </div>

                  {task.description && (
                    <div style={{
                      fontSize: '1rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6',
                      marginBottom: '0',
                      padding: '1rem',
                      background: 'rgba(247, 191, 216, 0.05)',
                      borderRadius: '12px',
                      borderLeft: '4px solid var(--color-accent-light)'
                    }}>
                      {task.description.length > 150
                        ? `${task.description.substring(0, 150)}...`
                        : task.description
                      }
                    </div>
                  )}

                  {/* Meta informações */}
                  <div className="task-meta" style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    fontSize: '0.95rem'
                  }}>
                    <span
                      className={`priority-badge ${getPriorityBadge(task.priority)}`}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '25px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {task.priority === 'high' ? '🔴 Alta' :
                       task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                    </span>

                    {task.dueDate && (
                      <span style={{
                        color: 'var(--color-text-secondary)',
                        background: 'rgba(247, 191, 216, 0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        📅 {formatDate(task.dueDate)}
                      </span>
                    )}

                    {task.time && (
                      <span style={{
                        color: 'var(--color-text-secondary)',
                        background: 'rgba(251, 213, 229, 0.1)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        ⏰ {task.time}
                      </span>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap'
                      }}>
                        {task.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            style={{
                              background: 'rgba(253, 234, 242, 0.8)',
                              color: 'var(--color-text-secondary)',
                              padding: '0.375rem 0.875rem',
                              borderRadius: '16px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              border: '1px solid rgba(247, 191, 216, 0.3)'
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '0.8rem',
                            fontStyle: 'italic'
                          }}>
                            +{task.tags.length - 3} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de ação - Sempre visíveis */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  alignItems: 'stretch',
                  minWidth: '200px',
                  marginTop: '0.5rem'
                }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    style={{
                      fontSize: '0.9rem',
                      padding: '0.75rem 1rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s',
                      width: '100%'
                    }}
                  >
                    <option value="todo">📋 A Fazer</option>
                    <option value="in-progress">🔄 Em Progresso</option>
                    <option value="done">✅ Concluída</option>
                  </select>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    width: '100%'
                  }}>
                    <button
                      className="btn btn-secondary"
                      style={{
                        fontSize: '0.9rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(247, 191, 216, 0.1)',
                        border: '2px solid var(--color-border)',
                        color: 'var(--color-accent)',
                        fontWeight: '600',
                        flex: '1',
                        borderRadius: '12px'
                      }}
                      onClick={() => onEditTask(task)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="btn"
                      style={{
                        fontSize: '0.9rem',
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg, #B91C1C 0%, #7F1D1D 100%)',
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        flex: '1',
                        borderRadius: '12px'
                      }}
                      onClick={() => onDeleteTask(task.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>

              {/* Efeito de hover */}
              <div style={{
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(135deg, rgba(247, 191, 216, 0.05) 0%, rgba(251, 213, 229, 0.05) 100%)',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                borderRadius: '16px'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Animação de entrada */}
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .task-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(247, 191, 216, 0.15);
            border-color: var(--color-accent-light);
          }

          .task-item:hover > div:last-child {
            opacity: 1 !important;
          }
        `}
      </style>
    </div>
  );
}

export default TaskList;
