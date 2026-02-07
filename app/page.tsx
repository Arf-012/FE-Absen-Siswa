"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, User, Lock, CheckCircle2, AlertCircle } from "lucide-react";

// Validation schemas
const loginSchema = z.object({
  nomorInduk: z.string().min(1, "Nomor Induk harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
  ingatSaya: z.boolean().optional(),
});

const tokenSchema = z.object({
  token: z.string().min(1, "Token tidak boleh kosong"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type TokenFormData = z.infer<typeof tokenSchema>;

type Screen = "login" | "error" | "success" | "token" ;

export default function LoginPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nomorInduk: "",
      password: "",
      ingatSaya: false,
    },
  });

  const tokenForm = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    // Simulate login validation
    if (data.nomorInduk === "wrong" || data.password === "wrong") {
      setErrorMessage("Kredensial akun salah atau belum terdaftar.");
      setCurrentScreen("error");
    } else {
      // Open token modal instead of navigating to token screen
      setShowTokenModal(true);
      setTokenError("");
      tokenForm.reset();
    }
  };

  const onTokenSubmit = (data: TokenFormData) => {
    // Simulate token validation
    if (data.token === "wrong") {
      setTokenError("Token salah atau belum valid");
    } else {
      setShowTokenModal(false);
      setCurrentScreen("success");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Screen (Screen 1) */}
        {currentScreen === "login" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Selamat Datang</h1>
              <p className="text-sm text-blue-100 mt-1">Masuk ke akun anda untuk melanjutkan</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="nomorInduk" className="text-gray-700">
                    Nomor Induk Siswa
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="nomorInduk"
                      type="text"
                      placeholder="Masukkan Nomor Induk"
                      className="pl-10"
                      {...loginForm.register("nomorInduk")}
                    />
                  </div>
                  {loginForm.formState.errors.nomorInduk && (
                    <p className="text-sm text-red-500 mt-1">
                      {loginForm.formState.errors.nomorInduk.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan Password"
                      className="pl-10"
                      {...loginForm.register("password")}
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ingatSaya"
                    checked={loginForm.watch("ingatSaya")}
                    onCheckedChange={(checked) => 
                      loginForm.setValue("ingatSaya", checked as boolean)
                    }
                  />
                  <label
                    htmlFor="ingatSaya"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Ingat Saya
                  </label>
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Masuk
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Token Screen (Screen 2) */}
        {currentScreen === "token" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Selamat Datang</h1>
              <p className="text-sm text-blue-100 mt-1">Masuk ke akun anda untuk melanjutkan</p>
            </div>
            
            <div className="p-6">
              <div className="bg-white border-2 border-blue-500 rounded-lg p-4 mb-4">
                <h2 className="font-bold text-lg text-center mb-1">
                  Silahkan Masukkan
                </h2>
                <h2 className="font-bold text-lg text-center">
                  Token Absen Hari Ini
                </h2>
              </div>

              <form onSubmit={tokenForm.handleSubmit(onTokenSubmit)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="token"
                      type="text"
                      placeholder="Masukkan Token"
                      className="pl-10"
                      {...tokenForm.register("token")}
                    />
                  </div>
                  {tokenForm.formState.errors.token && (
                    <p className="text-sm text-red-500 mt-1">
                      {tokenForm.formState.errors.token.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Masuk
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Token Screen (Screen 2) */}
        {currentScreen === "token" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Selamat Datang</h1>
              <p className="text-sm text-blue-100 mt-1">Masuk ke akun anda untuk melanjutkan</p>
            </div>
            
            <div className="p-6">
              <div className="bg-white border-2 border-blue-500 rounded-lg p-4 mb-4">
                <h2 className="font-bold text-lg text-center mb-1">
                  Silahkan Masukkan
                </h2>
                <h2 className="font-bold text-lg text-center">
                  Token Absen Hari Ini
                </h2>
              </div>

              <form onSubmit={tokenForm.handleSubmit(onTokenSubmit)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="token"
                      type="text"
                      placeholder="Masukkan Token"
                      className="pl-10"
                      {...tokenForm.register("token")}
                    />
                  </div>
                  {tokenForm.formState.errors.token && (
                    <p className="text-sm text-red-500 mt-1">
                      {tokenForm.formState.errors.token.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Masuk
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Error Screen - Login Error (Screen 3) */}
        {currentScreen === "error" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Selamat Datang</h1>
              <p className="text-sm text-blue-100 mt-1">Masuk ke akun anda untuk melanjutkan</p>
            </div>
            
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="nomorInduk2" className="text-gray-700">
                    Nomor Induk Siswa
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="nomorInduk2"
                      type="text"
                      placeholder="Masukkan Nomor Induk"
                      className="pl-10"
                      {...loginForm.register("nomorInduk")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password2" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password2"
                      type="password"
                      placeholder="Masukkan Password"
                      className="pl-10"
                      {...loginForm.register("password")}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ingatSaya2"
                    checked={loginForm.watch("ingatSaya")}
                    onCheckedChange={(checked) => 
                      loginForm.setValue("ingatSaya", checked as boolean)
                    }
                  />
                  <label
                    htmlFor="ingatSaya2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Ingat Saya
                  </label>
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Masuk
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Success Screen (Screen 5) */}
        {currentScreen === "success" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-6 text-center">
              <h1 className="text-2xl font-bold">Selamat Datang</h1>
            </div>
            
            <div className="p-6 flex flex-col items-center justify-center py-12">
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 flex flex-col items-center">
                <CheckCircle2 className="h-24 w-24 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-center">
                  Anda sudah
                </h2>
                <h2 className="text-2xl font-bold text-center">
                  TRABSEN!
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Token Modal */}
        <Dialog open={showTokenModal} onOpenChange={setShowTokenModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="bg-white border-2 border-blue-500 rounded-lg p-4 -mt-2">
                <DialogTitle className="text-lg font-bold text-center mb-1">
                  Silahkan Masukkan
                </DialogTitle>
                <DialogTitle className="text-lg font-bold text-center">
                  Token Absen Hari Ini
                </DialogTitle>
              </div>
            </DialogHeader>

            <form onSubmit={tokenForm.handleSubmit(onTokenSubmit)} className="space-y-4 mt-2">
              {tokenError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{tokenError}</p>
                </div>
              )}

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="token"
                    type="text"
                    placeholder="Masukkan Token"
                    className="pl-10"
                    {...tokenForm.register("token")}
                  />
                </div>
                {tokenForm.formState.errors.token && (
                  <p className="text-sm text-red-500 mt-1">
                    {tokenForm.formState.errors.token.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                <ArrowRight className="mr-2 h-4 w-4" />
                Masuk
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
