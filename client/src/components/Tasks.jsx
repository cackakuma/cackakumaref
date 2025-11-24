const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl shadow-md border bg-white dark:bg-gray-900">
      <div>
        <p className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.text}
        </p>
        <span className="block text-sm text-gray-500 mt-1">{task.content}</span>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => onToggle(task._id)}
          className="px-3 py-1 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
        >
          {task.completed ? "Undo" : "Done"}
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="px-3 py-1 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;