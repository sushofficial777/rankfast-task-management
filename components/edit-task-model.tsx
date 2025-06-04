"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Calendar, Bell, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import DatePicker from "@/components/elements/custom/DatePicker";
import GenericSelect from "@/components/elements/custom/Select";
import { hourOptions } from "@/lib/common.utils";
import { updateTaskMethod, getAllUsersForSelectMethod } from "@/apis/apiService";
import { toast } from "sonner";
import type { Task } from "@/types/task";

interface EditTaskModalProps {
  onClose: () => void;
  onSubmit: (updated: Task) => void;
  task: Task;
}

interface UserOption {
  value: string;
  label: string;
}

export default function EditTaskModal({ onClose, onSubmit, task }: EditTaskModalProps) {

  const [title, setTitle] = useState(task.title || "");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(task.dueDate));
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(task.priority);
  const [description, setDescription] = useState(task.description || "");
  const [notification, setNotification] = useState(task.notifications || 0);
  const [assignee, setAssignee] = useState(task.assignee?.id._id || "");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersForSelectMethod();
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async () => {
    if (!title.trim() || loading) return;

    try {
      setLoading(true);
      const updatedTask = {
        title: title.trim(),
        dueDate: moment(selectedDate).format("YYYY-MM-DD"),
        priority,
        description,
        notifications: notification,
        assignee: {
          name: users.find((u:any) => u.value === assignee)?.label || task.assignee?.name || "Me",
          id: assignee || task.assignee?.id || "0",
        },
      };

      const response = await updateTaskMethod(task._id, updatedTask);
      onSubmit(response.data);
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 w-full">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold placeholder:text-gray-400"
              autoFocus
            />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Due Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700 w-24">Due date</span>
            <div className="relative flex gap-2 items-center">
              <div className="bg-gray-100 px-3 py-2 text-sm rounded-md min-w-[120px] text-gray-700">
                {moment(selectedDate).format("DD MMM YYYY")}
              </div>
              <Button onClick={() => setOpen(!open)} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
             <DatePicker
                className="absolute top-full right-0  z-50"
                open={open}
                setOpen={setOpen}
                onSelect={(date: any) => setSelectedDate(date)}
              />
            </div>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700 w-24">Notify before</span>
            <GenericSelect
              options={hourOptions(10)}
              placeholder="Minutes"
              onSelect={(val:any) => setNotification(Number(val))}
              className="w-[140px] h-8"
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-3">
            <Flag className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700 w-24">Priority</span>
            <div className="flex gap-2">
              {["High", "Medium", "Low"].map((p) => (
                <Button
                  key={p}
                  variant={priority === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriority(p as any)}
                  className={`rounded-full px-4 ${priority === p ? "bg-yellow-400 text-black font-semibold" : ""}`}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-gray-700 w-24">Assign to</span>
            <GenericSelect
              options={users}
              placeholder="Select user"
              onSelect={(val:any) => setAssignee(val)}
             
              className="w-[160px] h-8"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <Textarea
              placeholder="Edit the description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleUpdate}
            disabled={!title.trim() || loading}
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-lg"
          >
            {loading ? "Updating..." : "Update Task"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
