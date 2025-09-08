import {
  ArrowUpRightIcon,
  ComputerIcon,
  GlobeIcon,
  HomeIcon,
  TerminalIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function TopBar({
  appName,
  children,
  repoId,
  consoleUrl,
  codeServerUrl,
}: {
  appName: string;
  children?: React.ReactNode;
  repoId: string;
  consoleUrl: string;
  codeServerUrl: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<'monthly' | 'yearly' | false>(false);

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
      // Don't reset isLoading here - let the redirect happen first
    }
  };

  return (
    <div className="h-12 sticky top-0 flex items-center px-4 border-b border-gray-200 bg-background justify-between">
      <div className="flex items-center gap-4">
        <Link href={"/"}>
          <HomeIcon className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Upgrade button */}
        <Button 
          size="sm" 
          variant="default" 
          onClick={() => setUpgradeModalOpen(true)}
        >
          <span>Upgrade</span>
        </Button>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant={"ghost"}>
              <img
                src="/logos/vscode.svg"
                className="h-4 w-4"
                alt="VS Code Logo"
              />
              <TerminalIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Open In</DialogTitle>
            </DialogHeader>
            <div>
              <div className="flex flex-col gap-2 pb-4">
                <div className="font-bold mt-4 flex items-center gap-2">
                  <GlobeIcon className="inline h-4 w-4 ml-1" />
                  Browser
                </div>
                <div>
                  <a href={codeServerUrl} target="_blank" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/logos/vscode.svg"
                          className="h-4 w-4"
                          alt="VS Code Logo"
                        />
                        <span>VS Code</span>
                      </div>
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <div>
                  <a href={consoleUrl} target="_blank" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <TerminalIcon className="h-4 w-4" />
                        <span>Console</span>
                      </div>
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to AUN.AI Pro</DialogTitle>
            <DialogDescription>
              Unlock unlimited messages and premium features with AUN.AI Pro.
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
                disabled={isLoading === 'monthly'}
                className={isLoading === 'monthly' ? "whitespace-nowrap opacity-50" : "whitespace-nowrap"}
              >
                {isLoading === 'monthly' ? "Processing..." : "Upgrade"}
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Yearly Plan</h3>
                <p className="text-sm text-muted-foreground">$250/year</p>
              </div>
              <Button 
                onClick={() => handleUpgrade('yearly')} 
                disabled={isLoading === 'yearly'}
                className={isLoading === 'yearly' ? "whitespace-nowrap opacity-50" : "whitespace-nowrap"}
              >
                {isLoading === 'yearly' ? "Processing..." : "Upgrade"}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              Cancel anytime. All plans include unlimited messages and premium features.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}