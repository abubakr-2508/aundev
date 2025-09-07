"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function UpgradePrompt({ messageCount }: { messageCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<'monthly' | 'yearly' | false>(false);

  // Show the upgrade prompt after 5 messages
  useEffect(() => {
    if (messageCount === 5) {
      setIsOpen(true);
    }
  }, [messageCount]);

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(plan);
    
    try {
      // Call your API to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan, // 'monthly' or 'yearly'
        }),
      });
      
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });
        
        if (error) {
          console.error('Error redirecting to checkout:', error);
        }
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to AUN.AI Pro</DialogTitle>
          <DialogDescription>
            You've reached the limit of free messages. Upgrade to AUN.AI Pro for unlimited access.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Monthly Plan</h3>
              <p className="text-sm text-muted-foreground">$25/month</p>
            </div>
            <Button 
              onClick={() => handleUpgrade('monthly')} 
              disabled={isLoading === 'monthly' || isLoading === 'yearly'}
              className="whitespace-nowrap"
            >
              {isLoading === 'monthly' ? "Processing..." : "upgrade to aun.ai pro"}
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Yearly Plan</h3>
              <p className="text-sm text-muted-foreground">$250/year</p>
            </div>
            <Button 
              onClick={() => handleUpgrade('yearly')} 
              disabled={isLoading === 'monthly' || isLoading === 'yearly'}
              className="whitespace-nowrap"
            >
              {isLoading === 'yearly' ? "Processing..." : "upgrade to aun.ai pro"}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Cancel anytime. All plans include unlimited messages and premium features.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}