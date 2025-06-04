interface User {
  _id: string
  name: string
  email: string
  role: string
  profileImageUrl: string
}
export interface Task {
  _id: string
  title: string
  dueDate: string // Format: YYYY-MM-DD
  priority: "High" | "Medium" | "Low"
  stage: "0" | "1" | "2" // 0: Not, 1: In Progress, 2: Done
  team: string
  assignee: {
    name: string
    id: User
  }
  files: string[];
  links: string[];
  completed: boolean
  description: string
  notifications: number
  time: string,
  startedAt: string,
  endedAt: string
}
