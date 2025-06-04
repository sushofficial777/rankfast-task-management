"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { uploadImageToSupabase } from "@/lib/utils/uploadImageToSupabase";
import { RegisterMethod } from "@/api/apiService";
import { toast } from "sonner";
import Massages from "@/lib/data/messages";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    image: z.any().refine((file) => file instanceof FileList && file.length > 0, {
      message: "Image is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageFile = watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setPreview(URL.createObjectURL(file));
      setImageFiles(file);

      // Create a new FileList to satisfy Zod
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue("image", dataTransfer.files, { shouldValidate: true });
    }
  };


  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      let profileImageUrl = "";
  
      if (imageFiles) {
        const { url, error } = await uploadImageToSupabase(imageFiles);
        if (error || !url) {
          alert("Image upload failed: " + error);
          setIsLoading(false);
          return;
        }
        profileImageUrl = url;
      }
  
      const { name, email, password } = data;
  
      const res = await RegisterMethod({
        name,
        email,
        password,
        profileImageUrl,
      });
  
      if (res.status === 200) {
        toast.success(Massages.ACCOUNT_CREATED);
  
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
  
        if (signInRes?.error) {
          toast.error("Invalid email or password");
          setIsLoading(false);
        } else {
          toast.success("Login successful");
          setIsLoading(false);
          router.push("/");
        }
      } else {
        // Handle non-200 responses if needed
        toast.error("Registration failed");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    } finally {
      console.log(Massages.RESISTRATION_COMPLETED);
    }
  };
  

  return (
    <main className="min-h-screen lg:py-0 md:py-10 py-10 flex items-center justify-center bg-[#f8f6f5] px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white shadow-md rounded-2xl flex flex-col items-center p-8 space-y-6"
      >
        {/* Avatar Upload with Animation */}
        <motion.div
          className="relative w-24 h-24"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="cursor-pointer">
            <Image
              src={preview || "https://bgxcdvyyekqyrpopgcry.supabase.co/storage/v1/object/public/hobby//undraw_young-man-avatar_wgbd.svg"}
              alt="Avatar"
              fill
              className="rounded-full object-cover border-1 border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1">
              <Pencil className="w-4 h-4 text-white" />
            </div>
          </label>
        </motion.div>
        {typeof errors.image?.message === "string" && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errors.image.message}
          </motion.p>
        )}

        {/* Form Section with staggered animations */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {/* Name */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-500 transition"
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            Continue <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.form>

        {/* Link to Login */}
        <motion.div
          className="w-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link className="underline text-xs" href={"/login"}>
            Log-In
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
