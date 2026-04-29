import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContextValue';
import {
  CheckCircle2,
  Clock,
  Plus,
  Loader2,
  Filter,
  MoreVertical,
  Calendar,
  AlertCircle,
  FileText,
  Trash2,
  ChevronDown,
  Banknote
} from 'lucide-react';
import { toast } from 'react-toastify';

const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    internship: ''
  });
  const [students, setStudents] = useState([]);
  const [myInternships, setMyInternships] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (user.role === 'recruiter' || user.role === 'admin') {
      fetchSupportData();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      // If student, filter tasks assigned to self
      if (user.role === 'student') {
        setTasks(data.filter(t => t.assignedTo?._id === user._id));
      } else {
        setTasks(data);
      }
    } catch {
      toast.error('Failed to sync task management board.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportData = async () => {
    try {
      // Get accepted students and recruiter's internships
      const [studentsRes, internshipsRes] = await Promise.all([
        api.get('/users?role=student'),
        api.get('/internships/my-postings')
      ]);
      setStudents(studentsRes.data);
      setMyInternships(internshipsRes.data);
    } catch (error) {
      console.error('Support data error', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task assigned to student successfully.');
      setShowAddModal(false);
      fetchTasks();
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', internship: '' });
    } catch {
      toast.error('Deployment failed.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
      toast.info(`Task status migrated to ${status}.`);
    } catch {
      toast.error('Failed to update task status.');
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center min-h-[400px] gap-4"><Loader2 className="animate-spin text-blue-600" size={48} /><p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Task Board...</p></div>;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Task Assignments</h2>
          <p className="text-slate-500 font-medium italic">Monitor progress, manage workload, and track project milestones.</p>
        </div>
        {(user.role === 'recruiter' || user.role === 'admin') && (
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary self-stretch md:self-auto uppercase tracking-tighter">
            <Plus size={20} />
            <span>Create New Task</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['To Do', 'In Progress', 'In Review', 'Completed'].map(column => (
          <div key={column} className="space-y-4">
            <div className="flex items-center justify-between px-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${column === 'Completed' ? 'bg-emerald-500' :
                    column === 'In Progress' ? 'bg-blue-500' :
                      column === 'In Review' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                {column}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {tasks.filter(t => t.status === column).length}
              </span>
            </div>

            <div className="space-y-4 min-h-[200px]">
              {tasks.filter(t => t.status === column).map(task => (
                <div key={task._id} className="glass-card !p-5 hover:border-slate-300 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{task.title}</h4>
                    <div className="relative">
                      <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-300">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {task.assignedTo?.name?.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 truncate w-20">{user.role === 'student' ? 'You' : task.assignedTo?.name}</span>
                    </div>
                    <div className="text-[10px] font-black text-rose-500 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>

                  {user.role === 'student' && column !== 'Completed' && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {['To Do', 'In Progress', 'In Review', 'Completed']
                        .filter(s => s !== column)
                        .map(nextStatus => (
                          <button
                            key={nextStatus}
                            onClick={() => handleUpdateStatus(task._id, nextStatus)}
                            className="whitespace-nowrap px-3 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-slate-100 transition-colors"
                          >
                            To {nextStatus}
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
              ))}
              {tasks.filter(t => t.status === column).length === 0 && (
                <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center opacity-30 italic text-[10px] font-bold text-slate-400">
                  Buffer Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg shadow-2xl !p-0 overflow-hidden border border-slate-100 bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Configure New Task</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Define parameters for student assignment.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <Trash2 size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subject Title</label>
                    <input
                      type="text"
                      className="input-field !bg-white !border-slate-200 !text-slate-900 focus:!border-blue-500"
                      placeholder="e.g. Implement Professional Dashboard"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Detailed Briefing</label>
                    <textarea
                      className="input-field !bg-white !border-slate-200 !text-slate-900 focus:!border-blue-500 h-32 py-4"
                      placeholder="Specify project requirements and technical constraints..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lead Entity</label>
                      <select
                        className="input-field !bg-white !border-slate-200 !text-slate-900 focus:!border-blue-500"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                        required
                      >
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Deadline</label>
                      <input
                        type="date"
                        className="input-field !bg-white !border-slate-200 !text-slate-900 focus:!border-blue-500"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Associated Internship</label>
                    <select
                      className="input-field !bg-white !border-slate-200 !text-slate-900 focus:!border-blue-500"
                      value={newTask.internship}
                      onChange={(e) => setNewTask({ ...newTask, internship: e.target.value })}
                      required
                    >
                      <option value="">Select Project</option>
                      {myInternships.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
                    </select>
                  </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary !bg-white !text-slate-600 !border-slate-200 flex-1 uppercase font-black text-[10px] tracking-widest hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 uppercase font-black text-[10px] tracking-widest">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
