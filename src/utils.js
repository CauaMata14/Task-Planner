// Utility functions for the Task Planner app

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 50)
 * @returns {string} Truncated text with ellipsis if applicable
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Formats a date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

/**
 * Gets priority badge styling class
 * @param {string} priority - Task priority (high, medium, low)
 * @returns {string} CSS class name for priority badge
 */
export const getPriorityBadge = (priority) => {
  const badges = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
  };
  return badges[priority] || 'priority-medium';
};
