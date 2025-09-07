"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export function ChatHistory({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  // This is a placeholder for chat history
  // In a real implementation, you would fetch actual chat history from your API
  const chatHistory = [
    { id: "1", title: "Build a personal website", date: "Today" },
    { id: "2", title: "Create a todo app", date: "Yesterday" },
    { id: "3", title: "Design a dashboard", date: "May 15" },
    { id: "4", title: "Plan a marketing campaign", date: "May 12" },
    { id: "5", title: "Research competitors", date: "May 10" },
  ];

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
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r bg-muted/10 w-64">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1 p-2">
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start h-10 px-3 py-2 text-sm font-normal text-left"
            >
              <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
            U
          </div>
          <div className="text-sm font-medium">User</div>
        </div>
      </div>
    </div>
  );
}