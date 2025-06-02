"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateContent()
    updateActiveStates()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const updateActiveStates = () => {
    setIsActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          execCommand("bold")
          break
        case "i":
          e.preventDefault()
          execCommand("italic")
          break
        case "u":
          e.preventDefault()
          execCommand("underline")
          break
      }
    }
  }

  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
  }

  const toolbarButtons = [
    {
      group: "formatting",
      buttons: [
        { icon: Bold, command: "bold", active: isActive.bold, tooltip: "Bold (Ctrl+B)" },
        { icon: Italic, command: "italic", active: isActive.italic, tooltip: "Italic (Ctrl+I)" },
        { icon: Underline, command: "underline", active: isActive.underline, tooltip: "Underline (Ctrl+U)" },
      ],
    },
    {
      group: "headings",
      buttons: [
        { icon: Heading1, command: "formatBlock", value: "h1", tooltip: "Heading 1" },
        { icon: Heading2, command: "formatBlock", value: "h2", tooltip: "Heading 2" },
        { icon: Heading3, command: "formatBlock", value: "h3", tooltip: "Heading 3" },
      ],
    },
    {
      group: "lists",
      buttons: [
        { icon: List, command: "insertUnorderedList", tooltip: "Bullet List" },
        { icon: ListOrdered, command: "insertOrderedList", tooltip: "Numbered List" },
        { icon: Quote, command: "formatBlock", value: "blockquote", tooltip: "Quote" },
      ],
    },
    {
      group: "alignment",
      buttons: [
        { icon: AlignLeft, command: "justifyLeft", tooltip: "Align Left" },
        { icon: AlignCenter, command: "justifyCenter", tooltip: "Align Center" },
        { icon: AlignRight, command: "justifyRight", tooltip: "Align Right" },
      ],
    },
    {
      group: "media",
      buttons: [
        { icon: Link, action: insertLink, tooltip: "Insert Link" },
        { icon: ImageIcon, action: insertImage, tooltip: "Insert Image" },
        { icon: Code, command: "formatBlock", value: "pre", tooltip: "Code Block" },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
    >
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((group, groupIndex) => (
            <div key={group.group} className="flex items-center">
              {group.buttons.map((button, buttonIndex) => (
                <Button
                  key={buttonIndex}
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${button.active ? "bg-yellow-100 text-yellow-800" : ""}`}
                  onClick={() => {
                    if (button.action) {
                      button.action()
                    } else {
                      execCommand(button.command, button.value)
                    }
                  }}
                  title={button.tooltip}
                >
                  <button.icon className="w-4 h-4" />
                </Button>
              ))}
              {groupIndex < toolbarButtons.length - 1 && <Separator orientation="vertical" className="mx-2 h-6" />}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={updateContent}
        onKeyUp={updateActiveStates}
        onMouseUp={updateActiveStates}
        onKeyDown={handleKeyDown}
        style={{
          lineHeight: "1.6",
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        [contenteditable] li {
          margin: 0.5rem 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
      `}</style>
    </motion.div>
  )
}
