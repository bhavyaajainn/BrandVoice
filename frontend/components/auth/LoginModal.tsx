import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/lib/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { Brain, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const {
    login,
    signup,
    loginWithGoogle,
    error: authError,
    verificationSent,
  } = useAuthContext();

  useEffect(() => {
    if (authError) {
      setError(authError);
      setLoading(false);
    }
  }, [authError]);

  useEffect(() => {
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (activeTab === "signup") {
      setShowSuccessMessage(false);
    }
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      // Only close modal and redirect on successful login
      setLoading(false);
      router.push("/dashboard");
      handleModalClose();
    } catch (err: any) {
      // Don't close modal on error, just show error and stop loading
      setLoading(false);
      // Error is already set by AuthContext via useEffect
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowSuccessMessage(false);
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      setLoading(false);
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords don't match. Please make sure both passwords are identical"
      );
      setLoading(false);
      return;
    }

    try {
      await signup(email, password);
      setLoading(false);
      setShowSuccessMessage(true);
      setActiveTab("login");
      setPassword("");
      setConfirmPassword("");
      setError(null);
    } catch (err: any) {
      setLoading(false);
      
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await loginWithGoogle();
      setLoading(false);
      router.push("/dashboard");
      handleModalClose();
    } catch (err: any) {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setShowSuccessMessage(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setActiveTab("login");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-[95%] sm:max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="mb-2 sm:mb-4">
          <DialogTitle className="flex items-center justify-between text-lg sm:text-xl">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span>
                {activeTab === "login" ? "Welcome Back" : "Join BrandVoice AI"}
              </span>
            </div>
            <button
              onClick={handleModalClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </DialogTitle>
        </DialogHeader>

        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-green-800">
                  Account created successfully!
                </h3>
                <p className="text-xs sm:text-sm text-green-700 mt-1">
                  Please check your email to verify your account before logging
                  in. You cannot log in until your email is verified.
                </p>
                {verificationSent && (
                  <p className="text-xs text-green-600 mt-1">
                    Verification email sent!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-3 sm:space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogin(e);
            }} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                  required
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-xs sm:text-sm h-8 sm:h-9 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2 sm:p-3 text-xs sm:text-sm text-red-700 flex items-start">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">Login Failed</span>
                    <br />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 text-[10px] sm:text-xs">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleGoogleLogin();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm h-8 sm:h-9"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sign in with Google</span>
                </>
              )}
            </motion.button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-3 sm:space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSignup(e);
            }} className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="signup-email" className="text-xs sm:text-sm">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                  required
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="signup-password" className="text-xs sm:text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-xs sm:text-sm h-8 sm:h-9 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs sm:text-sm"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-xs sm:text-sm h-8 sm:h-9 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2 sm:p-3 text-xs sm:text-sm text-red-700 flex items-start">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">Sign Up Failed</span>
                    <br />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 text-[10px] sm:text-xs">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleGoogleLogin();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-1.5 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm h-8 sm:h-9"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing up...</span>
                </div>
              ) : (
                <>
                  <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Sign up with Google</span>
                </>
              )}
            </motion.button>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-gray-500 text-center mt-4">
          <span className="font-medium">Demo credentials:</span>{" "}
          demo@example.com / password
          <br />
          <span className="text-gray-400">
            Or try incorrect credentials to see error handling
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}