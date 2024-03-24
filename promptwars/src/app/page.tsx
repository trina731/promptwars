"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Typewriter from "typewriter-effect";

export default function Home() {
  const [target, setTarget] = useState("");
  const [advType, setAdvType] = useState("Problematic");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 bg-white  ">
      <div className="justify-center items-center flex flex-col gap-y-5">
        <img src="/fuzzy.png" alt="fuzzy" className="bg-transparent" />
        <div className="text-4xl">PROMPT WARS</div>
        <div className="text-sm italic -mt-2">
          Self-improving LLM-Guided Fuzzing for LLMs
        </div>
        <Typewriter
          options={{
            strings: [
              "Who was the fourth president of the United States?",
              "Who is the character that lives in the pineapple under the sea?",
              "What is the difference between memoization and memorization?",
            ],
            autoStart: true,
            wrapperClassName: "text-lg italic text-slate-500",
            cursorClassName: "text-lg italic text-slate-500",
            loop: true,
            delay: 30,
          }}
        />
        <Input
          className="bg-slate-100"
          placeholder="Enter question"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              window.location.href = `/war?target=${target}`;
            }
          }}
        />

        <div className="flex flex-row items-center gap-x-2">
        <span className="text-sm text-gray-400">Adversarial Type:</span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="text-center bg-slate-200 rounded-md flex flex-row px-3 py-1 items-center">
              {advType} <ChevronDownIcon className="ml-2 h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setAdvType("Problematic")}>
              Problematic
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAdvType("Confusing")}>
              Confusing
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>


        <Button
          onClick={() => (window.location.href = `/war?target=${target}&advType=${advType}`)}
        >
          Generate
        </Button>
      </div>
    </main>
  );
}
