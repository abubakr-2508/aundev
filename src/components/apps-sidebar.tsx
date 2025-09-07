"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserApps } from "@/actions/user-apps";
import Link from "next/link";

export function AppsSidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const { data: apps = [] } = useQuery({
    queryKey: ["userApps"],
    queryFn: getUserApps,
    initialData: [],
  });

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
          
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="h-8 w-8"
          >
            <Link href="/app/new">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
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
        <Button className="w-full" asChild>
          <Link href="/app/new">
            <Plus className="mr-2 h-4 w-4" />
            New App
          </Link>
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {apps.map((app) => (
            <Button
              key={app.id}
              variant="ghost"
              className="w-full justify-start h-10 px-3 py-2 text-sm font-normal text-left"
              asChild
            >
              <Link href={`/app/${app.id}`}>
                <AppWindow className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{app.name}</span>
              </Link>
            </Button>
          ))}
          
          {apps.length === 0 && (
            <div className="text-center text-muted-foreground text-sm p-4">
              No apps created yet
            </div>
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
  );
}