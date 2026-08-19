import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initialEditors, initialProjects } from './data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// State store
let editors = [...initialEditors];
let projects = [...initialProjects];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gogangs Express Backend Server is running!' });
});

// GET /api/editors - Fetch all editors with optional filters
app.get('/api/editors', (req, res) => {
  const { search, status, availability } = req.query;
  let result = [...editors];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (status && status !== 'All') {
    result = result.filter((e) => e.verificationStatus === status);
  }

  res.json(result);
});

// GET /api/editors/:id - Fetch single editor
app.get('/api/editors/:id', (req, res) => {
  const editor = editors.find((e) => e.id === req.params.id);
  if (!editor) {
    return res.status(404).json({ error: 'Editor not found' });
  }
  res.json(editor);
});

// POST /api/editors - Add new editor
app.post('/api/editors', (req, res) => {
  const newEditor = {
    id: `e-${Date.now()}`,
    active: true,
    verificationStatus: 'Pending',
    lastLogin: new Date().toISOString(),
    rating: 5.0,
    portfolioLinks: [],
    sampleVideos: [],
    ...req.body,
  };
  editors.unshift(newEditor);
  res.status(201).json(newEditor);
});

// PUT /api/editors/:id - Update editor verification status or details
app.put('/api/editors/:id', (req, res) => {
  const index = editors.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Editor not found' });
  }
  editors[index] = { ...editors[index], ...req.body };
  res.json(editors[index]);
});

// GET /api/projects - Fetch all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// GET /api/projects/:id - Fetch single project
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// POST /api/projects - Create project
app.post('/api/projects', (req, res) => {
  const newProject = {
    id: `p-${Date.now()}`,
    status: 'In Progress',
    subtasks: [],
    ...req.body,
  };
  projects.unshift(newProject);
  res.status(201).json(newProject);
});

// PUT /api/projects/:projectId/subtasks/:subtaskId - Update subtask status / feedback
app.put('/api/projects/:projectId/subtasks/:subtaskId', (req, res) => {
  const { projectId, subtaskId } = req.params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const subtask = project.subtasks.find((st) => st.id === subtaskId);
  if (!subtask) {
    return res.status(404).json({ error: 'Subtask not found' });
  }

  Object.assign(subtask, req.body);
  res.json(subtask);
});

// GET /api/review-queue - Submissions awaiting review
app.get('/api/review-queue', (req, res) => {
  const queue = projects.flatMap((p) =>
    p.subtasks
      .filter((st) => st.status === 'Ready for Review')
      .map((st) => {
        const editor = editors.find((e) => e.id === st.assignedEditorIds[0]);
        return {
          ...st,
          projectTitle: p.title,
          projectId: p.id,
          editorName: editor?.fullName || 'Unknown',
          editorAvatar: editor?.avatarUrl || '',
          editorId: editor?.id || '',
        };
      })
  );
  res.json(queue);
});

// GET /api/dashboard/stats - Admin dashboard aggregated metrics
app.get('/api/dashboard/stats', (req, res) => {
  const totalEditors = editors.length;
  const verifiedEditors = editors.filter((e) => e.verificationStatus === 'Verified').length;
  const pendingEditors = editors.filter((e) => e.verificationStatus === 'Pending').length;
  const totalProjects = projects.length;
  const reviewQueueCount = projects.flatMap((p) => p.subtasks).filter((st) => st.status === 'Ready for Review').length;

  res.json({
    totalEditors,
    verifiedEditors,
    pendingEditors,
    totalProjects,
    reviewQueueCount,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Gogangs Express Backend server running on http://localhost:${PORT}`);
});
