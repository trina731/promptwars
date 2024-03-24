"use client";

import { ChatMessage, Model } from "@/components/ChatMessage/ChatMessage";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface State {
  target?: string;
  prompts?: string[];
  responses?: string[];
  scores?: string[];
}

export default function Home() {
  const [target, setTarget] = useState(
    new URLSearchParams(window.location.search).get("target") || ""
  );

  const [state, setState] = useState<State>({} as State);
  const [started, setStarted] = useState(false);


  useEffect(() => {
    const start = async () => {
      if (!target || started) return;
      setStarted(true);


      const payload = {
        target: target,
      };
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    };

    start();
  }, [target]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const payload = {};
      const response = await fetch("http://127.0.0.1:5000/get-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);
      setState(data);
    }, 3000);

    return () => clearInterval(interval);
  });

  const [model, setModel] = useState<Model>();

  return (
    <div className="flex flex-col items-center">
      <div className="h-10 border-b-[1px] items-center px-2 flex justify-between w-full sticky top-0 bg-white z-50">
        <span className="flex flex-row items-center gap-x-3">
          <img src="/fuzzy.png" alt="fuzzy" className="bg-transparent h-4" />
          <span>PROMPT WARS</span>
        </span>
        <div className="flex flex-row justify-center items-center">
          <span>
            <span className="italic mr-1">Generating things for</span>
            <span className="font-semibold">{target}</span>
          </span>
        </div>

        <a className="flex flex-row items-center cursor-pointer" href="/">
          Return to home <ArrowRightIcon className="h-3" />
        </a>
      </div>
      <div className="p-3 max-w-[1200px] w-[90%]">
        {state.prompts?.map((prompt, index) => (
          <div className="grid grid-cols-9 w-full border-y-[1px]" key={index}>
            <div className="col-span-4">
              <ChatMessage model={Model.FUZZER} text={prompt} target={target} />
            </div>
            {state.responses?.[index] && <div className="col-span-4">
              <ChatMessage model={Model.MISTRAL} text={state.responses?.[index]} target={target} />
            </div>}
            {state.scores?.[index] && <div className="col-span-1 flex justify-center items-center text-lg max-h-[300px]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{state.scores?.[index][0]}</TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm max-w-[200px]">{state.scores?.[index][1]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>}

          </div>
        ))}
      </div>
    </div>
  );
}
