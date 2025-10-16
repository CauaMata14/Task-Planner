import React, { useState } from 'react';
import { truncateText, getPriorityBadge } from '../utils';

function KanbanBoard({ tasks, onEditTask, onDeleteTask, onUpdateTaskStatus }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = {
    todo: {
      title: '📋 A Fazer',
      tasks: tasks.filter(task => task.status === 'todo'),
      color: '#f7bfd8',
      bgColor: 'rgba(247, 191, 216, 0.05)'
    },
    'in-progress': {
      title: '🔄 Em Progresso',
      tasks: tasks.filter(task => task.status === 'in-progress'),
      color: '#fbd5e5',
      bgColor: 'rgba(251, 213, 229, 0.05)'
    },
    done: {
      title: '✅ Concluída',
      tasks: tasks.filter(task => task.status === 'done'),
      color: '#fdeaf2',
      bgColor: 'rgba(253, 234, 242, 0.05)'
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.6';
    e.target.style.transform = 'rotate(3deg) scale(1.02)';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    e.target.style.transform = 'rotate(0deg) scale(1)';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetColumn, targetIndex = null) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask) return;

    const sourceColumn = draggedTask.status;
    const targetColumnId = targetColumn;

    if (sourceColumn === targetColumnId && targetIndex === null) return;

    try {
      if (sourceColumn !== targetColumnId) {
        await onUpdateTaskStatus({
          ...draggedTask,
          status: targetColumnId
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="kanban-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className={`kanban-column ${dragOverColumn === columnId ? 'drag-over' : ''}`}
            style={{
              minHeight: '400px',
              background: column.bgColor,
              border: `2px solid ${column.color}`,
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease'
            }}
            onDragOver={(e) => handleDragOver(e, columnId)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, columnId)}
          >
            {/* Header simples da coluna */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: column.color,
              color: 'white',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              {column.title} ({column.tasks.length})
            </div>

            <div style={{
              minHeight: '300px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {column.tasks.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic',
                    padding: '3rem 1rem',
                    border: `2px dashed ${column.color}`,
                    borderRadius: '12px',
                    backgroundColor: dragOverColumn === columnId ? `${column.color}20` : 'transparent',
                    transition: 'all 0.3s ease',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                  onDragOver={(e) => handleDragOver(e, columnId)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, columnId, 0)}
                >
                  <div style={{ fontSize: '2rem', opacity: '0.5' }}>📥</div>
                  <div style={{ fontSize: '0.9rem' }}>Arraste aqui</div>
                </div>
              ) : (
                <>
                  {column.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`kanban-card ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      style={{
                        cursor: draggedTask?.id === task.id ? 'grabbing' : 'grab',
                        marginBottom: '1rem',
                        background: 'var(--color-surface)',
                        border: `1px solid ${column.color}`,
                        borderRadius: '12px',
                        padding: '1.25rem',
                        transition: 'all 0.3s ease',
                        opacity: draggedTask?.id === task.id ? '0.8' : '1'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          fontSize: '1rem',
                          opacity: '0.6',
                          cursor: 'grab',
                          lineHeight: '1'
                        }}>
                          ⋮⋮
                        </div>
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            lineHeight: '1.3',
                            color: task.status === 'done' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                            textDecoration: task.status === 'done' ? 'line-through' : 'none'
                          }}>
                            {task.title}
                          </div>

                          {task.description && (
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'var(--color-text-secondary)',
                              lineHeight: '1.4',
                              marginBottom: '0.75rem'
                            }}>
                              {truncateText(task.description, 60)}
                            </div>
                          )}

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.5rem'
                          }}>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              background: task.priority === 'high' ? '#fee2e2' :
                                        task.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                              color: task.priority === 'high' ? '#dc2626' :
                                     task.priority === 'medium' ? '#d97706' : '#16a34a'
                            }}>
                              {task.priority === 'high' ? '🔴 Alta' :
                               task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                            </span>

                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(247, 191, 216, 0.1)',
                                  border: `1px solid ${column.color}`,
                                  color: column.color,
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditTask(task);
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.25rem 0.5rem',
                                  background: '#dc2626',
                                  border: 'none',
                                  color: 'white',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTask(task.id);
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Estilos simples */}
      <style>
        {`
          .kanban-card:hover {
            box-shadow: 0 4px 12px rgba(247, 191, 216, 0.2);
            border-color: var(--color-accent-light);
          }

          .kanban-card.dragging {
            opacity: 0.8;
            transform: rotate(2deg) scale(1.02);
            box-shadow: 0 8px 20px rgba(247, 191, 216, 0.3);
          }
        `}
      </style>
    </>
  );
}

export default KanbanBoard;
