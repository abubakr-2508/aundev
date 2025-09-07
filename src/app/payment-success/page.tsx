"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Here you would typically verify the session with your backend
      // For now, we'll just simulate a successful payment
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);
    } else {
      // No session ID, redirect to home
      router.push("/");
    }
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Payment Verification Failed</h1>
          <p className="mt-2">There was an issue verifying your payment.</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold mt-4">Payment Successful!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for upgrading to AUN.AI Pro. You now have unlimited access to all features.
        </p>
        <div className="mt-8 p-4 bg-accent rounded-lg">
          <h2 className="font-semibold">What's included in AUN.AI Pro:</h2>
          <ul className="mt-2 text-left space-y-1 text-sm">
            <li>• Unlimited messages</li>
            <li>• Priority processing</li>
            <li>• Advanced AI models</li>
            <li>• Early access to new features</li>
          </ul>
        </div>
        <Button onClick={() => router.push("/")} className="mt-8">
          Start Using AUN.AI Pro
        </Button>
      </div>
    </div>
  );
}