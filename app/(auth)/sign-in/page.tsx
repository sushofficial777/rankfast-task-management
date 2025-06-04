"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {toast} from "sonner";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer types
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error || "Invalid email or password");
    } else {
      toast.success("Login successful!");
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fbf9ff] px-4">
      <motion.div
        className="w-full max-w-5xl bg-white shadow-md rounded-2xl flex flex-col md:flex-row overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Illustration */}
        <motion.div
          className="w-full lg:flex md:flex hidden  md:w-1/2 bg-[#fcf9f5]  items-center justify-center p-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="https://bgxcdvyyekqyrpopgcry.supabase.co/storage/v1/object/public/hobby//undraw_taking-notes_4si1.svg"
            alt="Task.M illustration"
            width={500}
            height={500}
            className="max-w-full h-auto"
            priority
          />
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-1/2 flex flex-col items-center justify-center p-10"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center mb-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { delayChildren: 0.2, staggerChildren: 0.1 },
              },
            }}
          >
            <motion.div
              className="bg-yellow-400 rounded-full p-2"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <span className="text-black font-semibold text-lg">TM</span>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-gray-900 mt-2"
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              Task.M
            </motion.h1>
          </motion.div>

          <motion.div
            className="w-full max-w-sm"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { delayChildren: 0.4, staggerChildren: 0.1 },
              },
            }}
          >
            <label
              htmlFor="email"
              className="block text-sm text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email"
              className={`w-full px-4 py-2 mb-1 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mb-2">{errors.email.message}</p>
            )}

            <label
              htmlFor="password"
              className="block text-sm text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className={`w-full px-4 py-2 mb-4 rounded-md border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mb-4">{errors.password.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-black font-medium rounded-full hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="w-full mt-5 flex items-center justify-center">
              <Link className="underline text-xs" href={"/sign-up"}>
                Sign-Up
              </Link>
            </div>
          </motion.div>
        </motion.form>
      </motion.div>
    </main>
  );
}
