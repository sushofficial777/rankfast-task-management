"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Eye, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import type { Blog } from "@/types/blog"

interface BlogEditorProps {
  blog?: Blog | null
  onSave: (blog: Omit<Blog, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [author, setAuthor] = useState("John Doe")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)

  useEffect(() => {
    if (blog) {
      setTitle(blog.title)
      setContent(blog.content)
      setExcerpt(blog.excerpt)
      setAuthor(blog.author)
      setStatus(blog.status)
      setTags(blog.tags)
    }
  }, [blog])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const blogData: Omit<Blog, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      content,
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
      author,
      status,
      tags,
    }

    onSave(blogData)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">{blog ? "Edit Blog Post" : "Create New Blog Post"}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsPreview(!isPreview)} className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          /* Preview Mode */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <article className="bg-white rounded-lg p-8 shadow-sm">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{author}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                    <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div className="flex gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </header>

                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </div>
          </motion.div>
        ) : (
          /* Edit Mode */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog post title..."
                  className="text-lg font-medium"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your blog post..."
                  rows={3}
                />
              </div>

              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select value={status} onValueChange={(value: "draft" | "published") => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your blog post..." />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
