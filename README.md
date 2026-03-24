# Project Tracker
A React + TypeScript frontend project management tool with Kanban, List, and Timeline views. Built from scratch to demonstrate custom drag-and-drop, virtual scrolling, live collaboration indicators, and filterable views.

## Live Demo
Click to see the tracker in action - 

## Features
### Three Views of the Same Data
1. Kanban Board with four columns: To Do, In Progress, In Review, Done.
2. List View with sortable columns and virtual scrolling for large datasets.
3. Timeline/Gantt View plotting tasks over the current month.
### Custom Drag-and-Drop
1. Drag tasks between Kanban columns with smooth placeholder handling.
2. Works on both mouse and touch devices.
3. Snap-back behavior when dropped outside valid columns.
### Virtual Scrolling
1. Only renders rows visible in the viewport in List View.
2. Handles 500+ tasks smoothly without lag.
### Live Collaboration Indicators
1. Simulated users viewing or editing tasks.
2. Active users displayed on task cards and in the top bar.
### Filters & URL State
1. Multi-select filters for status, priority, assignee, and due date range.
2. Filters reflected in the URL for shareable/bookmarkable filtered views.
3. Clear filters button appears only when filters are active.
### Empty States & Edge Cases
1. Styled empty state for empty Kanban columns.
2. List View shows a message when no results match filters.
3. “Due Today” label and overdue task labeling.
### Tech Stack
1. Frontend: React + TypeScript
2. Styling: Tailwind CSS
3. State Management: Zustand
4. Deployment: Vercel

## Project Structure
src/
 ├─ components/       # Reusable UI components (Avatar, TaskCard, PriorityBadge, etc.)
 ├─ store/            # Zustand store and types
 ├─ views/            # Kanban, List, Timeline views
 ├─ data/             # Task generator
 └─ App.tsx           # Main entry with view switching

## Getting Started
1. Clone the repository:
```
git clone https://github.com/your-username/project-tracker.git
cd project-tracker
```
2. Install dependencies:
```
npm install
```
3. Runthe development server:
```
npm run dev
```
4. Open http://localhost:5173 in your browser.
