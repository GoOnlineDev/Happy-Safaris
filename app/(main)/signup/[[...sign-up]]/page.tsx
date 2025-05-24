"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#1a2421] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-8 transform hover:scale-105 transition-transform">
            <div className="relative h-16 w-64 mx-auto">
              <Image
                src="/logo.png"
                alt="Happy African Safaris"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#e3b261] mb-3">Create Account</h1>
            <p className="text-gray-400 text-lg">Join us to start your African adventure</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#2a3431]/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-[#3a4441]"
        >
          <SignUp
            appearance={{
              baseTheme: undefined,
              elements: {
                formButtonPrimary: "bg-[#e3b261] hover:bg-[#c49a51] text-[#1a2421] font-semibold transition-colors w-full rounded-md px-4 py-2",
                formFieldInput: "bg-[#3a4441] border border-[#4a5451] text-white rounded-md px-3 py-2 w-full focus:outline-none focus:border-[#e3b261] transition-colors",
                formFieldLabel: "text-gray-300 font-medium block mb-1.5",
                card: "space-y-6 bg-transparent",
                header: "hidden",
                footer: "hidden",
                dividerLine: "bg-[#3a4441]",
                dividerText: "text-gray-400",
                socialButtonsBlockButton: "bg-[#3a4441] text-white hover:bg-[#4a5451] border border-[#4a5451] transition-colors w-full rounded-md px-4 py-2 flex items-center justify-center gap-2",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldSuccessText: "text-green-500",
                formFieldErrorText: "text-red-500",
                alert: "text-red-500",
                rootBox: "bg-transparent",
                main: "bg-transparent",
                form: "bg-transparent"
              },
              layout: {
                socialButtonsPlacement: "bottom",
                showOptionalFields: false,
                termsPageUrl: "/terms"
              },
            }}
            redirectUrl="/"
            signInUrl="/login"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-lg">
            Already have an account?{" "}
            <Link href="/login" className="text-[#e3b261] hover:text-[#c49a51] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 