"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { UpgradeModal } from "@/components/upgrade-modal";

export default function AppLimitReachedPage() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const router = useRouter();

  // Listen for upgrade requests from other components
  useEffect(() => {
    const handleUpgradeRequest = () => {
      setIsUpgradeModalOpen(true);
    };

    window.addEventListener('upgradeRequested', handleUpgradeRequest);
    return () => {
      window.removeEventListener('upgradeRequested', handleUpgradeRequest);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>App Creation Limit Reached</CardTitle>
          <CardDescription>
            You've reached the maximum number of apps for your free plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Free users can create up to 3 apps. Upgrade to AUN.AI Pro for unlimited app creation.
          </p>
          
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => setIsUpgradeModalOpen(true)}>
              Upgrade to Pro
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
}