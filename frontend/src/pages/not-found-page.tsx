import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-10 max-w-md text-center backdrop-blur-2xl"
      >
        <div className="mx-auto w-20 h-20 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center mb-6">
          <FileQuestion className="h-10 w-10 text-brand-400" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-white/70 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild variant="gradient" size="lg" className="w-full">
          <Link to="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
