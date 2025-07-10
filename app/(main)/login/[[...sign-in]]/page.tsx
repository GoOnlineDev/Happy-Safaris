"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 sm:px-0"
      >
        <div className="text-center mb-6 sm:mb-8 mt-12 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2 sm:mb-3">Welcome Back</h1>
            <p className="text-gray-400 text-base sm:text-lg">Sign in to your account to continue your adventure</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-background-light/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-8 border border-accent"
        >
          <SignIn
            appearance={{
              baseTheme: undefined,
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-secondary font-semibold transition-colors w-full rounded-md px-4 py-2",
                formFieldInput: "bg-accent border border-accent/80 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:border-primary transition-colors",
                formFieldLabel: "text-gray-300 font-medium block mb-1.5",
                card: "space-y-6 bg-transparent",
                header: "hidden",
                footer: "hidden",
                dividerLine: "bg-accent",
                dividerText: "text-gray-400",
                socialButtonsBlockButton: "bg-accent text-white hover:bg-accent/80 border border-accent/80 transition-colors w-full rounded-md px-4 py-2 flex items-center justify-center gap-2",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldSuccessText: "text-green-500",
                formFieldErrorText: "text-red-500",
                alert: "text-red-500",
                rootBox: "bg-transparent",
                main: "bg-transparent",
                form: "bg-transparent"
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false
              },
            }}
            redirectUrl="/"
            signUpUrl="/signup"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6 sm:mt-8"
        >
          <p className="text-gray-400 text-base sm:text-lg">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/90 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 