"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, User, Calendar, Flag, Paperclip, Link, Trash2, PlayIcon, FileCheck2, Activity, Loader, Mail, XIcon, RotateCw, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Task } from "@/types/task"
import { Slider } from "@/components/ui/slider"
import { updateTaskMethod, getTaskByIdMethod } from "@/apis/apiService";
import { toast } from "sonner";
import { getTimeSpentPercentage } from "@/lib/common.utils"
import { TASK_STAGE_LABELS } from "@/lib/data/constents"
import moment from "moment";
import { uploadImageToSupabase as uploadFile } from "@/lib/utils/uploadImageToSupabase";

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
}


export function TaskDetailModal({ task, onClose, onUpdate, onDelete }: TaskDetailModalProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localTask, setLocalTask] = useState<Task>(task)

  const [time, setTime] = useState<number[]>([0])

  const [loadingStart, setLoadingStart] = useState<boolean>(false)
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false)

  const [progress, setProgress] = useState(0);


  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStartTask = async () => {
    setLoadingStart(true)
    try {
      const updatedTask = await updateTaskMethod(localTask._id, {
        time: time[0],
        startedAt: new Date(),
        stage: "1",
        isNotification: true,
      })
      onUpdate(updatedTask.data.data)
      setLocalTask(updatedTask.data.data)
      toast.success("Task started successfully");
      onClose()
    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoadingStart(false)
    }

  };
  const handleEndTask = async () => {
    setLoadingUpdate(true)
    try {
      const updatedTask = await updateTaskMethod(localTask._id, {
        completed: true,
        endedAt: new Date(),
        stage: "2",
        isNotification: true,
      })
      onUpdate(updatedTask.data.data)
      setLocalTask(updatedTask.data.data)
      toast.success("Task ended successfully");
      onClose()
    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoadingUpdate(false)
    }

  };

  const handleRefresh = async () => {
    setLoadingRefresh(true)
    try {
      const updatedTask = await getTaskByIdMethod(localTask._id)
      onUpdate(updatedTask.data.data)
      setLocalTask(updatedTask.data.data)
    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoadingRefresh(false)
    }

  };

  const handleSliderChange = (value: number[]) => {
    setTime(value);
  };


  const onAttechmentChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      setLoadingFile(true);

      let fileUrl = "";

      if (file) {
        const { url, error } = await uploadFile(file);
        if (error || !url) {
          alert("file upload failed: " + error);
          setLoadingFile(false);
          return;
        }
        fileUrl = url;
      }
      setLoadingUpdate(true)
      try {
        const updatedTask = await updateTaskMethod(localTask._id, {
          files: localTask.files && localTask.files.length > 0 ? [...localTask.files, fileUrl] : [fileUrl],
        })
        console.log("Updated task successfully", updatedTask);
        onUpdate(updatedTask.data.data)
        setLocalTask(updatedTask.data.data)
        toast.success("Task Updated successfully");
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch tasks")
      } finally {
        setLoadingUpdate(false)
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      console.log("Updated task successfully");
      setLoadingFile(false)
    }
  };

  const handleRemoveFile = async (indexToRemove: number) => {
    setLoadingUpdate(false)
    try {
      const updatedFiles = localTask.files.filter((_, index) => index !== indexToRemove);
      const updatedTask = await updateTaskMethod(localTask._id, {
        files: updatedFiles,
      })
      console.log("Updated task successfully", updatedTask);
      onUpdate(updatedTask.data.data)
      setLocalTask(updatedTask.data.data)
      toast.success("Task Updated successfully");
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch tasks")
    } finally {
      setLoadingUpdate(false)
    }
  };


  useEffect(() => {
    const percentage = getTimeSpentPercentage(localTask.startedAt, localTask.time);
    setProgress(Number(percentage));
  }, [localTask.startedAt, localTask.time]);


  useEffect(() => {
    setLocalTask(task);
  }, [task]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white h-full w-96 p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{localTask.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Assignee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Assignee</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={localTask.assignee.id.profileImageUrl || "/placeholder.svg"} alt={localTask.assignee.name} />
                <AvatarFallback>
                  {localTask.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Me</span>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Deadline</span>
            </div>
            <Badge variant="outline" className="bg-gray-900 text-white border-gray-900">
              {moment(localTask.dueDate).format("MMM D, YYYY")}
            </Badge>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">Priority</span>
            </div>
            <Badge variant="outline" className={getPriorityColor(localTask.priority)}>
              {localTask.priority}
            </Badge>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <Badge variant="outline" >
              {TASK_STAGE_LABELS[localTask.stage]}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-medium"> Total Time</span>
          </div>
          <Badge variant="outline" >
            {localTask.time} h
          </Badge>
        </div>
        </div>

       
        { /* hare add statr <Play /> */}
        {
          !localTask.completed && <>
            <div className=" mt-10 flex  items-center justify-between ">
              {
                localTask.stage === "0" ? <>

                  <div className="text-sm font-medium w-[50px] flex items-center justify-center  text-gray-900 "> <p> <span className=" text-lg   " > {time[0]} </span> h</p> </div>
                  <Slider className="  " defaultValue={[0]} onValueChange={handleSliderChange} max={9} step={1} />
                  <button onClick={() => handleStartTask()} disabled={!time[0]} className="w-[50px] flex items-center justify-center"> <PlayIcon className={`w-5 ${time[0] ? 'hover:scale-125' : ''} duration-150`} /></button>
                </> : <>
                  <div className="w-full bg-gray-200 rounded-full h-5 relative overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-green-500 text-black text-xs flex items-center justify-center"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <span className=" ml-4 " > {progress > 5 && `${progress}%`}</span>
                    </motion.div>
                  </div>
                  <button onClick={() => handleRefresh()} className="w-[50px] flex items-center justify-center">
                    {loadingRefresh ? <RotateCw
                      className={`w-5 'hover:scale-125  text-green-600 duration-500 mx-2 ${loadingRefresh ? 'animate-spin' : ''}`}
                    /> : <RotateCw className={`w-5 hover:scale-125  text-green-600 duration-150 mx-2`} />
                    }
                  </button>

                </>
              }
            </div>
          </>
        }

        {/* Attachments */}
        <div className="mt-8">
          <div className=" flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Attachments</h3>

            <Button onClick={handleAttachClick} variant="ghost" size="sm" className="text-gray-600">
              <Paperclip className="w-4 h-4 mr-1" />
              Attach {loadingFile && <Loader
                className={`w-4 h-4 text-gray-600 ${loadingFile ? 'animate-spin' : ''}`}
              />}
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

            {localTask.files.length > 0 ?
              <div className="space-y-2">
                {localTask.files.map((file, index) => (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className=" absolute top-2 -right-3 w-5 h-5 bg-red-400/20 rounded-full text-[10px] flex items-center justify-center text-gray-600  hover:text-gray-900 hover:bg-red-100  transition-colors"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <XIcon className="w-5 h-5" />

                    </motion.button>
                    <a
                      key={index}
                      href={file} // assuming each `file` is a direct link (URL)
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex overflow-hidden items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Paperclip className="w-4 h-4 text-gray-600" />
                      <span className="truncate text-sm text-blue-600 underline">
                        {file.split('/').pop() || `File ${index + 1}`}
                      </span>
                    </a>
                  </div>
                ))}
              </div> : <>

                <div className="flex items-center gap-2 text-gray-600">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm">No attachments</span>
                </div>
              </>
            }


            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={onAttechmentChange}
              accept="*"
            />
          </div>
        </div>


        {/* Actions */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {
            !localTask.completed ? <>
              <Button disabled={loadingUpdate} onClick={() => handleEndTask()} variant="outline" className="flex-1 text-green-600 ">
                <FileCheck2 className="w-4 h-4 mr-2" />
                Mark Done
              </Button>
            </> : <>
              <div className=""></div>
            </>
          }
          <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete task
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
