"use client";

import { ChatMessage, Model } from "@/components/ChatMessage/ChatMessage";
import {
  ArrowRightIcon,
  LoaderIcon,
  ShareIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface State {
  target?: string;
  prompts?: string[];
  responses?: string[];
  scores?: string[];
  done?: boolean;
}

export default function Home() {
  const [target, setTarget] = useState(
    new URLSearchParams(window.location.search).get("target") || ""
  );
  const [advType, setAdvType] = useState(
    new URLSearchParams(window.location.search).get("advType") || "Problematic"
  );

  const [state, setState] = useState<State>({} as State);
  const [started, setStarted] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const start = async () => {
      if (!target || started) return;
      setStarted(true);

      const id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      setId(id);

      const payload = {
        target: target,
        id: id,
        advType: advType,
      };
      try {
        const response = await fetch("http://127.0.0.1:5000/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.warn(error);
      }
    };

    start();
  }, [target]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const payload = {
          id: id,
        };
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
      } catch (error) {
        console.warn(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  });

  const [model, setModel] = useState<Model>();

  return (
    <div className="flex flex-col items-center">
      <div className="h-10 border-b-[3px] items-center px-2 flex justify-between w-full sticky top-0 bg-white z-50">
        <span className="flex flex-row items-center gap-x-3">
          <img src="/fuzzy.png" alt="fuzzy" className="bg-transparent h-4" />
          <span>PROMPT WARS</span>
        </span>
        <div className="flex flex-row justify-center items-center">
          <span>
            <span className="italic mr-2">Generating prompts for:</span>
            <span className="font-semibold">
              {'"'}
              {target}
              {'"'}
            </span>
          </span>
        </div>

        <a className="flex flex-row items-center cursor-pointer" href="/">
          Return to home <ArrowRightIcon className="h-3" />
        </a>
      </div>
      <div className="p-3 max-w-[1200px] w-[90%]">
        <div className="grid grid-cols-9 w-full">
          <span className="grid grid-cols-9 col-span-9">
            <div className="col-span-4 text-center border-b border-r flex items-center justify-center">
              <span>Muzzer</span>
            </div>
            <div className="col-span-4 text-center border-b border-r flex items-center justify-center">
              <span>Mistral</span>
            </div>
            <div className="col-span-1 text-center border-b flex items-center justify-center">
              <span>Score</span>
            </div>
          </span>
          {state.prompts?.map((prompt, index) => (
            <>
              <div className="col-span-4">
                <ChatMessage
                  model={Model.FUZZER}
                  text={prompt}
                  target={target}
                />
              </div>
              {state.responses?.[index] ? (
                <div className="col-span-4">
                  <ChatMessage
                    model={Model.MISTRAL}
                    text={state.responses?.[index]}
                    target={target}
                  />
                </div>
              ) : (
                <div className="col-span-4 flex justify-center items-center text-lg max-h-[300px]">
                  <LoaderIcon className="animate-spin h-3" />
                </div>
              )}
              {state.scores?.[index] ? (
                <div className="col-span-1 flex justify-center items-center text-lg max-h-[300px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {state.scores?.[index][0]}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-[200px]  italic font-medium">
                          {state.scores?.[index][1]}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div className="col-span-1 flex justify-center items-center text-lg max-h-[300px]">
                  <LoaderIcon className="animate-spin h-3" />
                </div>
              )}
              <div className="bg-slate-400 h-px col-span-9" />
            </>
          ))}
          {!state.done && (
            <div className="col-span-9 flex justify-center items-center h-12">
              <LoaderIcon className="animate-spin h-5" />
            </div>
          )}
        </div>
        {state.done && (
          <div className="w-full justify-center flex my-5">
            <ShareIcon className="h-5 cursor-pointer stroke-slate-600 hover:stroke-black" />
            <ThumbsUpIcon className="h-5 cursor-pointer stroke-slate-600 hover:stroke-black" />
          </div>
        )}
        <div className="h-screen" />
      </div>
    </div>
  );
}
