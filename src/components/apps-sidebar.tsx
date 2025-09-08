"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserApps } from "@/actions/user-apps";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLimitTooltip } from "@/components/app-limit-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { renameApp } from "@/actions/rename-app";
import { deleteApp } from "@/actions/delete-app";
import { toast } from "sonner";

export function AppsSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const { data: apps = [], error, isLoading, refetch } = useQuery({
    queryKey: ["userApps"],
    queryFn: getUserApps,
    initialData: [],
    retry: false, // Don't retry on error
  });
  
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; app: { id: string; name: string } } | null>(null);
  const router = useRouter();

  // Fetch subscription info to check app limits
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/user-subscription");
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        } else {
          // Set default values if API call fails
          setSubscription({
            subscriptionType: "free",
            appCount: 0
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        // Set default values if API call fails
        setSubscription({
          subscriptionType: "free",
          appCount: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Check if user can create more apps
  const canCreateApp = () => {
    if (loading || !subscription) return true; // Allow by default while loading
    
    const isFreeUser = subscription.subscriptionType === "free";
    const appCount = subscription.appCount || 0;
    
    // Free users can create up to 3 apps, pro users have unlimited
    return !isFreeUser || appCount < 3;
  };

  const handleNewAppClick = () => {
    if (canCreateApp()) {
      router.push("/app/new");
    } else {
      // Redirect to app limit page
      router.push("/app-limit-reached");
    }
  };

  const handleContextMenu = (e: React.MouseEvent, app: { id: string; name: string }) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      app,
    });
  };

  const handleRenameApp = (app: { id: string; name: string }) => {
    setCurrentApp(app);
    setNewName(app.name);
    setIsRenameDialogOpen(true);
    setContextMenu(null);
  };

  const handleDeleteApp = (app: { id: string; name: string }) => {
    setCurrentApp(app);
    setIsDeleteDialogOpen(true);
    setContextMenu(null);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentApp) return;
    
    setIsRenaming(true);
    
    try {
      await renameApp(currentApp.id, newName);
      toast.success("App renamed successfully");
      setIsRenameDialogOpen(false);
      setCurrentApp(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to rename app");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentApp) return;
    
    setIsDeleting(true);
    
    try {
      await deleteApp(currentApp.id);
      toast.success("App deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentApp(null);
      // Refetch apps to update the list
      refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete app");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex h-full border-r bg-muted/10 w-12">
        <div className="flex flex-col items-center py-4 space-y-4 w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <AppLimitTooltip>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNewAppClick}
              disabled={!canCreateApp()}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </AppLimitTooltip>
        </div>
      </div>
    );
  }

  const isFreeUser = subscription?.subscriptionType === "free";
  const appCount = subscription?.appCount || 0;
  const appLimit = 3;

  return (
    <>
      <div className="flex flex-col h-full border-r bg-muted/10 w-64">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Apps</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggle}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <AppLimitTooltip>
            <Button 
              className="w-full" 
              onClick={handleNewAppClick}
              disabled={!canCreateApp()}
            >
              <Plus className="mr-2 h-4 w-4" />
              New App
            </Button>
          </AppLimitTooltip>
          
          {isFreeUser && appCount >= appLimit && (
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded mt-2 text-center">
              App limit reached ({appCount}/{appLimit})
            </div>
          )}
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 p-2">
            {isLoading ? (
              <div className="text-center text-muted-foreground text-sm p-4">
                Loading apps...
              </div>
            ) : error ? (
              <div className="text-center text-muted-foreground text-sm p-4">
                Please log in to see your apps
              </div>
            ) : apps.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm p-4">
                No apps created yet
              </div>
            ) : (
              apps.map((app) => (
                <div key={app.id} onContextMenu={(e) => handleContextMenu(e, { id: app.id, name: app.name })}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 px-3 py-2 text-sm font-normal text-left"
                    asChild
                  >
                    <Link href={`/app/${app.id}`}>
                      <AppWindow className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{app.name}</span>
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
              A
            </div>
            <div className="text-sm font-medium">Your Apps</div>
          </div>
        </div>
      </div>

      {/* Custom Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
            onClick={() => handleRenameApp(contextMenu.app)}
          >
            Rename
          </button>
          <button
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left"
            onClick={() => {
              router.push(`/app/${contextMenu.app.id}`);
              setContextMenu(null);
            }}
          >
            Open
          </button>
          <button
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full text-left text-red-600 dark:text-red-400"
            onClick={() => handleDeleteApp(contextMenu.app)}
          >
            Delete
          </button>
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename App</DialogTitle>
            <DialogDescription>
              Enter a new name for your app.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit}>
            <div className="py-4">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="App name"
                disabled={isRenaming}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                disabled={isRenaming}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isRenaming || !newName.trim()}>
                {isRenaming ? "Renaming..." : "Rename"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete App</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentApp?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeleteSubmit}>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}