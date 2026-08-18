import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-10 max-w-md text-center backdrop-blur-2xl"
      >
        <div className="mx-auto w-20 h-20 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">403</h1>
        <h2 className="text-xl font-semibold text-white mb-3">Access Denied</h2>
        <p className="text-white/70 mb-6">
          You don't have permission to access this page.
        </p>
        <Button asChild variant="gradient" size="lg" className="w-full">
          <Link to="/app/dashboard">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
