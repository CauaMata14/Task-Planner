import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Calendar({ tasks, onEditTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = parseISO(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  const changeMonth = (delta) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const formatTaskTime = (time) => {
    if (!time) return '';
    // Se o time estiver no formato HH:mm, retorna como está
    if (time.includes(':')) return time;
    // Se for apenas horas, adiciona :00
    return `${time}:00`;
  };

  const handleDayClick = (day, event) => {
    const dayTasks = getTasksForDay(day);
    if (dayTasks.length > 0) {
      const rect = event.target.getBoundingClientRect();
      setModalPosition({
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2
      });
      setSelectedDay({
        date: day,
        tasks: dayTasks
      });
    }
  };

  const handleDayMouseEnter = (day, event) => {
    const dayTasks = getTasksForDay(day);
    if (dayTasks.length > 0) {
      const rect = event.target.getBoundingClientRect();
      setTooltip({
        date: day,
        tasks: dayTasks,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 10
      });
    }
  };

  const handleDayMouseLeave = () => {
    setTooltip(null);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  const handleEditTaskFromModal = (task) => {
    onEditTask(task);
    setSelectedDay(null);
  };

  // Fecha modal quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedDay && !event.target.closest('.modal') && !event.target.closest('.calendar-day')) {
        setSelectedDay(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDay]);

  return (
    <>
      <div className="planner-card" style={{gridColumn: '1 / -1'}}>
        <div className="card-title">Calendário</div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <button
            className="btn btn-secondary"
            onClick={() => changeMonth(-1)}
          >
            ← Mês Anterior
          </button>
          <h3 style={{
            margin: 0,
            fontFamily: 'Playfair Display, serif',
            color: 'var(--color-accent)',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <button
            className="btn btn-secondary"
            onClick={() => changeMonth(1)}
          >
            Próximo Mês →
          </button>
        </div>

        <div className="calendar-grid">
          {/* Dias da semana */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} style={{
              fontWeight: '600',
              color: 'var(--color-accent)',
              padding: '0.75rem',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {day}
            </div>
          ))}

          {/* Dias do mês */}
          {calendarDays.map(day => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
                onClick={(e) => handleDayClick(day, e)}
                onMouseEnter={(e) => handleDayMouseEnter(day, e)}
                onMouseLeave={handleDayMouseLeave}
                style={{
                  position: 'relative',
                  cursor: dayTasks.length > 0 ? 'pointer' : 'default'
                }}
              >
                <div style={{
                  fontSize: '1rem',
                  fontWeight: isTodayDate ? '600' : '400',
                  color: isTodayDate ? 'white' : 'var(--color-text-primary)'
                }}>
                  {format(day, 'd')}
                </div>

                {/* Bolinha indicadora de tarefas (apenas quando não houver interação) */}
                {dayTasks.length > 0 && !tooltip && !selectedDay && (
                  <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    boxShadow: '0 0 0 2px rgba(247, 191, 216, 0.3)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip no Hover */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 15,
            top: tooltip.y - 15,
            background: 'var(--color-surface)',
            border: `2px solid var(--color-border)`,
            borderRadius: '12px',
            padding: '1rem',
            zIndex: 1000,
            maxWidth: '280px',
            boxShadow: '0 8px 25px rgba(247, 191, 216, 0.2)',
            pointerEvents: 'none',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.75rem',
            fontWeight: '600',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.5rem'
          }}>
            {format(tooltip.date, 'dd/MM/yyyy', { locale: ptBR })}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {tooltip.tasks.slice(0, 8).map(task => (
              <div key={task.id} style={{
                padding: '0.5rem',
                background: 'rgba(247, 191, 216, 0.1)',
                borderRadius: '6px',
                borderLeft: `3px solid ${task.priority === 'high' ? '#B91C3C' :
                                       task.priority === 'medium' ? '#B4536B' : '#B485A3'}`
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  lineHeight: '1.3'
                }}>
                  {formatTaskTime(task.time)} - {task.title}
                </div>
              </div>
            ))}
            {tooltip.tasks.length > 8 && (
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                E mais {tooltip.tasks.length - 8} tarefa{tooltip.tasks.length - 8 > 1 ? 's' : ''}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Tarefa */}
      {selectedDay && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(247, 191, 216, 0.3)',
            backdropFilter: 'blur(8px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="modal"
            style={{
              background: 'var(--color-surface)',
              border: `2px solid var(--color-border)`,
              borderRadius: '20px',
              padding: '2.5rem',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(247, 191, 216, 0.25)',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '6px',
              background: 'linear-gradient(90deg, var(--color-accent) 0%, #f7bfd8 50%, var(--color-accent-light) 100%)',
              borderRadius: '20px 20px 0 0'
            }} />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--color-accent) 0%, #f7bfd8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {format(selectedDay.date, 'dd/MM/yyyy', { locale: ptBR })}
              </div>
              <button
                className="btn-close"
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: '2px solid var(--color-border)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  transition: 'all 0.3s'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {selectedDay.tasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    background: 'rgba(247, 191, 216, 0.05)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    borderLeft: `4px solid ${task.priority === 'high' ? '#B91C3C' :
                                           task.priority === 'medium' ? '#B4536B' : '#B485A3'}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      margin: '0',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.3'
                    }}>
                      {task.title}
                    </h4>
                    <span className={`priority-badge ${task.priority === 'high' ? 'priority-high' :
                                                     task.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                      {task.priority === 'high' ? 'Alta' :
                       task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>

                  {task.time && (
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontWeight: '600' }}>⏰</span>
                      {formatTaskTime(task.time)}
                    </div>
                  )}

                  {task.description && (
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.5',
                      marginBottom: '1.5rem',
                      padding: '0.75rem',
                      background: 'rgba(247, 191, 216, 0.1)',
                      borderRadius: '8px'
                    }}>
                      {task.description}
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditTaskFromModal(task)}
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent) 0%, #f7bfd8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      width: '100%'
                    }}
                  >
                    ✏️ Editar Tarefa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;
