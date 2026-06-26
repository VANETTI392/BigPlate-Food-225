## 📋 TaskFlow - Todo List Application

A powerful, feature-rich todo list application with local storage functionality, task management, and beautiful UI.

### ✨ Features

#### 📌 Task Management
- ✅ Add tasks with title, description, category, priority, and due date
- 🔄 Edit existing tasks with modal interface
- ✓ Mark tasks as complete/incomplete
- 📋 Duplicate tasks quickly
- 🗑️ Delete individual tasks or clear all at once

#### 🎯 Organization
- **5 Categories**: Work, Personal, Shopping, Health, and All Tasks
- **3 Priority Levels**: High (🔴), Medium (🟡), Low (🟢)
- **Status Views**: All, Pending, Completed, Today
- **Task Descriptions**: Add detailed notes to each task

#### 🔍 Search & Filter
- Real-time search across task titles and descriptions
- Filter by category, status, priority, or date
- Multi-level filtering for precise task management
- Quick view for today's tasks

#### 📊 Statistics & Analytics
- Total task count
- Completed vs pending tasks
- Completion rate percentage
- Category breakdown
- Priority distribution
- Visual statistics dashboard

#### 💾 Data Management
- **Automatic Local Storage**: Tasks persist between sessions
- **Export Feature**: Download tasks as JSON file
- **Import Support**: Load previously exported tasks

#### 🎨 Design Features
- Modern, responsive UI
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Mobile-friendly layout
- Dark/light contrast for accessibility
- Emoji indicators for quick identification

### 🚀 Quick Start

1. Open `index.html` in your web browser
2. Start adding tasks using the form at the top
3. Select category, priority, and due date
4. Press Enter or click "Add Task"
5. Your tasks are automatically saved!

### 📁 File Structure

```
todo-app/
├── index.html       # Main HTML file
├── styles.css       # Complete styling
├── script.js        # All functionality
└── README.md        # This file
```

### 💻 Usage Guide

#### Adding a Task
1. Type task title in the input field
2. Select category (default: Work)
3. Choose priority (default: Medium)
4. Pick a due date (auto-set to today)
5. Click "Add Task" or press Enter

#### Managing Tasks
- **Complete**: Click checkbox to mark done
- **Edit**: Click ✏️ to modify task details
- **Duplicate**: Click 📋 to create copy
- **Delete**: Click 🗑️ to remove

#### Filtering & Sorting
- Use sidebar categories to filter by type
- Click "Views" to see pending/completed/today
- Search box for quick text search
- Sort by date, priority, or alphabetical order

#### Viewing Statistics
- Click "📊 Stats" in header
- See completion percentage
- View category and priority breakdown
- Track your productivity

#### Exporting Tasks
- Click "💾 Export" in header
- Download JSON file with all tasks
- File named: `tasks-YYYY-MM-DD.json`

### 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Add new task (when in input) |
| Escape | Close modal dialogs |

### 📱 Responsive Design

- **Desktop** (1024px+): Full sidebar + main content
- **Tablet** (768px-1024px): Responsive grid layout
- **Mobile** (480px-768px): Single column layout
- **Small Mobile** (<480px): Optimized compact view

### 💾 Local Storage

All data is stored in browser's LocalStorage:
- Key: `taskflow-tasks`
- Format: JSON array of task objects
- Persists across browser sessions
- No server required

### 🔧 Task Object Structure

```javascript
{
    id: 1234567890,           // Unique timestamp-based ID
    title: "Task title",       // Task name
    description: "",           // Optional description
    category: "work",          // work, personal, shopping, health
    priority: "medium",        // high, medium, low
    dueDate: "2024-06-26",     // YYYY-MM-DD format
    completed: false,          // Boolean status
    createdAt: "ISO timestamp" // Creation time
}
```

### 🎨 Customization

#### Change Theme Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3498db;      /* Main color */
    --secondary-color: #2ecc71;    /* Success color */
    --danger-color: #e74c3c;       /* Delete color */
    /* ... more colors ... */
}
```

#### Add New Categories
1. Add to HTML category list in sidebar
2. Add to JavaScript category options
3. Update emoji mapping in script

#### Modify Priority Levels
Edit priority arrays and color mappings in `script.js`

### 🔒 Data Privacy

- All data stored locally in your browser
- No data sent to servers
- No tracking or analytics
- Complete privacy and control

### 🐛 Troubleshooting

**Tasks not saving?**
- Check if LocalStorage is enabled
- Clear browser cache if having issues
- Export tasks before clearing

**Can't see all tasks?**
- Check if filters are active
- Use "All Tasks" category
- Clear search input

**Tasks disappeared?**
- Check browser storage settings
- Browser may have cleared LocalStorage
- Use exported JSON to restore

### 🚀 Future Enhancements

- [ ] Task categories customization
- [ ] Recurring tasks
- [ ] Task notes/attachments
- [ ] Dark mode toggle
- [ ] Custom themes
- [ ] Sync across devices
- [ ] Mobile app version
- [ ] Cloud backup
- [ ] Collaboration features
- [ ] Task analytics/reports

### 📧 Support

For issues or feature requests, please create an issue on GitHub.

### 📄 License

This project is open source and available under the MIT License.

---

**TaskFlow** - Manage Your Tasks Effectively 📋✨
