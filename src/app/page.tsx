"use client";

import { useRouter } from "next/navigation";
import { PromptInput, PromptInputActions } from "@/components/ui/prompt-input";
import { FrameworkSelector } from "@/components/framework-selector";
import Image from "next/image";
import LogoSvg from "@/logo.svg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExampleButton } from "@/components/ExampleButton";
import { UserButton } from "@stackframe/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PromptInputTextareaWithTypingAnimation } from "@/components/prompt-input";
import { UpgradeModal } from "@/components/upgrade-modal";
import { AppsSidebar } from "@/components/apps-sidebar";

const queryClient = new QueryClient();

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    router.push(
      `/app/new?message=${encodeURIComponent(prompt)}&template=${framework}`
    );
  };

  const handleUpgradeClick = () => {
    setIsUpgradeModalOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        {/* Apps Sidebar - Collapsible */}
        <AppsSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <main className="min-h-screen p-4 relative flex-1 flex flex-col">
            <div className="flex w-full justify-between items-center">
              <h1 className="text-lg font-bold flex-1 sm:w-80">
                <a href="https://www.aun.ai">AUN.AI</a>
              </h1>
              {/* Logo hidden as per user request */}
              {/* <Image
                className="dark:invert mx-2"
                src={LogoSvg}
                alt="aun.ai Logo"
                width={64}
                height={64}
              /> */}
              <div className="flex items-center gap-4 flex-1 sm:w-80 justify-end">
                <Button onClick={handleUpgradeClick} variant="default" size="sm">
                  Upgrade
                </Button>
                <UserButton />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-lg px-4 sm:px-0 mx-auto flex flex-col items-center mt-8 sm:mt-12 md:mt-16 col-start-1 col-end-1 row-start-1 row-end-1 z-10">
                <p className="text-neutral-600 text-center mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
                  Ideas In, Magic Out
                </p>

                <div className="w-full relative my-5">
                  <div className="relative w-full max-w-full overflow-hidden">
                    <div className="w-full bg-accent rounded-md relative z-10 border transition-colors">
                      <PromptInput
                        leftSlot={
                          <FrameworkSelector
                            value={framework}
                            onChange={setFramework}
                          />
                        }
                        isLoading={isLoading}
                        value={prompt}
                        onValueChange={setPrompt}
                        onSubmit={handleSubmit}
                        className="relative z-10 border-none bg-transparent shadow-none focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200 transition-all duration-200 ease-in-out "
                      >
                        <PromptInputTextareaWithTypingAnimation />
                        <PromptInputActions>
                          <Button
                            variant={"ghost"}
                            size="sm"
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt.trim()}
                            className="h-7 text-xs"
                          >
                            <span className="hidden sm:inline">
                              Start Creating ⏎
                            </span>
                            <span className="sm:hidden">Create ⏎</span>
                          </Button>
                        </PromptInputActions>
                      </PromptInput>
                    </div>
                  </div>
                </div>
                <Examples setPrompt={setPrompt} />
              </div>
            </div>
            
            <UpgradeModal 
              isOpen={isUpgradeModalOpen} 
              onClose={() => setIsUpgradeModalOpen(false)} 
            />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

function Examples({ setPrompt }: { setPrompt: (text: string) => void }) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center gap-2 px-2">
        <ExampleButton
          text="Finance tracking tool"
          promptText="Build a personal fianace tracking tool."
          onClick={(text) => {
            console.log("Example clicked:", text);
            setPrompt(text);
          }}
        />
        <ExampleButton
          text="Social media app for book lovers"
          promptText="Build a social media app for book lovers."
          onClick={(text) => {
            console.log("Example clicked:", text);
            setPrompt(text);
          }}
        />
        <ExampleButton
          text="Tools for managing  remote teams"
          promptText="Build a tools for managing  remote team."
          onClick={(text) => {
            console.log("Example clicked:", text);
            setPrompt(text);
          }}
        />
      </div>
    </div>
  );
}