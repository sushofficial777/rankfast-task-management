export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  createdAt: string
  updatedAt: string
  status: "draft" | "published"
  tags: string[]
}
