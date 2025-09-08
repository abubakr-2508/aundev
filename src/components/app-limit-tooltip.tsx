"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function AppLimitTooltip({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/user-subscription");
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading || !subscription) {
    return <>{children}</>;
  }

  const isFreeUser = subscription.subscriptionType === "free";
  const appCount = subscription.appCount || 0;
  const appLimit = 3;

  // Only show tooltip if user is on free plan and has reached limit
  if (isFreeUser && appCount >= appLimit) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">Free plan limit reached. Upgrade to Pro for unlimited apps.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <>{children}</>;
}