require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskplanner';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Erro MongoDB:', err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  estimatedTime: { type: Number },
  tags: [{ type: String }],
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Initialize with demo user if no users exist
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
}));

const Task = mongoose.model('Task', taskSchema);

// Initialize demo data
async function initializeDemoData() {
  try {
    console.log('🔄 Inicializando dados demo...');

    const userCount = await User.countDocuments();
    let demoUser;

    if (userCount === 0) {
      demoUser = new User({
        name: 'Demo User',
        email: 'demo@taskplanner.local'
      });
      await demoUser.save();
      console.log('👤 Demo user created');
    } else {
      demoUser = await User.findOne({ email: 'demo@taskplanner.local' });
    }

    const taskCount = await Task.countDocuments();
    if (taskCount === 0 && demoUser) {
      const demoTasks = [
        {
          title: 'Bem-vindo ao Task Planner!',
          description: 'Esta é uma tarefa de exemplo para testar o aplicativo.',
          status: 'todo',
          priority: 'high',
          userId: demoUser._id.toString(),
          dueDate: new Date(),
          tags: ['demo', 'boas-vindas']
        },
        {
          title: 'Configurar projeto',
          description: 'Organizar estrutura do projeto e dependências.',
          status: 'in-progress',
          priority: 'high',
          userId: demoUser._id.toString(),
          dueDate: new Date(Date.now() + 86400000),
          estimatedTime: 2,
          tags: ['projeto', 'organização']
        },
        {
          title: 'Implementar drag and drop',
          description: 'Adicionar funcionalidade de arrastar tarefas no kanban.',
          status: 'done',
          priority: 'medium',
          userId: demoUser._id.toString(),
          dueDate: new Date(Date.now() - 86400000),
          estimatedTime: 4,
          tags: ['frontend', 'ux']
        }
      ];

      await Task.insertMany(demoTasks);
      console.log('📝 Demo tasks created');
    }
  } catch (error) {
    console.error('Erro inicializando dados:', error);
  }
}

// Initialize demo data when server starts
mongoose.connection.once('open', () => {
  initializeDemoData();
});

// API Routes

// Get all tasks for a user
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (for demo purposes)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 MongoDB: ${mongoURI}`);
  console.log(`🔗 API disponível em: http://localhost:${PORT}/api`);
});
