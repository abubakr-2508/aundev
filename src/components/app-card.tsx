"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Trash, ExternalLink, MoreVertical, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteApp } from "@/actions/delete-app";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renameApp } from "@/actions/rename-app";

type AppCardProps = {
  id: string;
  name: string;
  createdAt: Date;
  onDelete?: () => void;
};

export function AppCard({ id, name, createdAt, onDelete }: AppCardProps) {
  const router = useRouter();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/app/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    await deleteApp(id);
    toast.success("App deleted successfully");
    if (onDelete) {
      onDelete();
    }

    console.log(`Delete app: ${id}`);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRenameDialogOpen(true);
    setNewName(name); // Reset to current name when opening dialog
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRenaming(true);
    
    try {
      await renameApp(id, newName);
      toast.success("App renamed successfully");
      setIsRenameDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to rename app");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      <Card className="p-3 sm:p-4 border-b border rounded-md h-32 sm:h-36 relative w-full">
        <Link href={`/app/${id}`} className="cursor-pointer block">
          <CardHeader className="p-0">
            <CardTitle className="text-sm sm:text-base truncate">
              {name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Created {createdAt.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
        </Link>

        <div className="absolute top-2 right-2 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpen}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRename}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

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
    </>
  );
}