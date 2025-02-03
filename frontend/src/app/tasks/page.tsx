'use client';

import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { createTask, getAllTasks, removeTask, updateTask } from '../api/api';
import { useRouter } from 'next/navigation';

function TaskModal({ task, isOpen, onClose, onSave }:any) {
  const [taskData, setTaskData] = useState(
    task || {
      description: '',
      completed: false,
      category: 'none',
      priority: 'medium',
    }
  );

  useEffect(() => {
    setTaskData(task || { description: '', completed: false, category: 'none', priority: 'medium' });
  }, [task]);

  const categories = ['None', 'Miscellaneous', 'Office', 'Personal', 'Freelance'];
  const priorities = ['High', 'Medium', 'Low'];

  const updateTaskField = (field:any, value:any) => {
    setTaskData((prev:any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(taskData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg w-[400px]">
        <h2 className="text-white text-xl mb-4">{task ? 'Edit Task' : 'New Task'}</h2>
        <textarea
          className="w-full p-2 rounded-lg text-black mb-4 resize-none min-h-[80px] max-h-[120px]"
          placeholder="Task Description"
          value={taskData.description}
          onChange={(e) => updateTaskField('description', e.target.value)}
        />
        <div className="mb-4">
          <label className="block text-white mb-1">Category</label>
          <select
            className="w-full p-2 rounded-lg text-black"
            value={taskData.category}
            onChange={(e) => updateTaskField('category', e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-white mb-1">Priority</label>
          <select
            className="w-full p-2 rounded-lg text-black"
            value={taskData.priority}
            onChange={(e) => updateTaskField('priority', e.target.value)}
          >
            {priorities.map((pri) => (
              <option key={pri} value={pri.toLowerCase()}>{pri}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Todo() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [modalTask, setModalTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks.data);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleSaveTask = async (taskData:any) => {
    if (taskData._id) {
      await updateTask(taskData._id, taskData);
      setTasks(tasks.map((t) => (t._id === taskData._id ? taskData : t)));
    } else {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask.data]);
    }
  };

  const handleDeleteTask = async (taskId:any) => {
    await removeTask(taskId);
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

 return (
    <div className="h-screen flex flex-col items-center bg-gray-900 text-white p-8 overflow-auto">
      <h1 className="text-5xl font-bold mb-6">My Tasks</h1>
      <button onClick={() => { setModalTask(null); setModalOpen(true); }} className="bg-blue-700 px-4 py-2 mb-4 rounded-lg">Add Task</button>
      {loading ? (
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      ) : (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
          {[...tasks]
            .sort((a, b) => {
              const priorityOrder :any = { high: 3, medium: 2, low: 1 };
              return (a.completed - b.completed) || (priorityOrder[b.priority] - priorityOrder[a.priority]);
            })
            .map((task) => (
              <div key={task._id} className="flex justify-between items-center p-4 mb-2 bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleSaveTask({ ...task, completed: !task.completed })}
                  className="mr-2"
                />
                <div className="flex-1 max-w-xs">
                  <span className={`text-lg block truncate ${task.completed ? 'line-through' : ''}`}>{task.description}</span>
                </div>
                <div className="text-right w-28">
                  <span className="text-sm text-gray-400 block">{task.category}</span>
                  <span className={`text-sm ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-green-500' : 'text-yellow-500'}`}>{task.priority}</span>
                </div>
                <button onClick={() => { setModalTask(task); setModalOpen(true); }} className="text-yellow-400 hover:text-yellow-300 ml-4">
                  <FaEdit size={18} />
                </button>
                <button onClick={() => handleDeleteTask(task._id)} className="text-red-400 hover:text-red-300 ml-2">
                  <FaTrash size={18} />
                </button>
              </div>
            ))}
        </div>
      )}
      <TaskModal task={modalTask} isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTask} />
    </div>
  );

}
