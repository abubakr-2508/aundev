"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionDashboard() {
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

  const handleManageSubscription = async () => {
    try {
      // In a real implementation, you would redirect to the Stripe customer portal
      // This is a simplified version
      alert("Redirecting to subscription management...");
    } catch (error) {
      console.error("Error managing subscription:", error);
    }
  };

  if (loading) {
    return <div>Loading subscription information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          Manage your AUN.AI subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscription ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {subscription.subscriptionType === "yearly" 
                    ? "Yearly Plan" 
                    : subscription.subscriptionType === "monthly" 
                      ? "Monthly Plan" 
                      : "Free Plan"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.subscriptionType === "free" 
                    ? "Limited to 5 messages" 
                    : "Unlimited messages"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {subscription.subscriptionType === "yearly" 
                    ? "$250/year" 
                    : subscription.subscriptionType === "monthly" 
                      ? "$25/month" 
                      : "Free"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {subscription.subscriptionStatus}
                </p>
              </div>
            </div>
            
            {subscription.subscriptionType !== "free" && (
              <Button onClick={handleManageSubscription} variant="outline">
                Manage Subscription
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p>No subscription information found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simple upgrade button component for use in the header
export function UpgradeToProButton() {
  // This component will be updated to use the modal
  const handleUpgrade = () => {
    // For now, we'll keep the simple redirect
    window.location.href = "/";
  };

  return (
    <Button onClick={handleUpgrade} variant="default" size="sm">
      Upgrade to Pro
    </Button>
  );
}