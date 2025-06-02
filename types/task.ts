export interface Task {
  id: string
  title: string
  dueDate: string // Format: YYYY-MM-DD
  priority: "High" | "Medium" | "Low"
  stage: "Not started" | "In progress" | "Completed"
  team: string
  assignee: {
    name: string
    avatar: string
  }
  completed: boolean
  description: string
  tags: string[]
  notifications: string[]
}
