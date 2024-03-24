"use client";

import { ChatMessage, Model } from "@/components/ChatMessage/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface State {
  target?: string;
  prompts?: string[];
  responses?: string[];
}

export default function Home() {
  const [target, setTarget] = useState(
    new URLSearchParams(window.location.search).get("target") || ""
  );

  const [state, setState] = useState<State>({} as State);
  const [started, setStarted] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!target || started) return;
    const start = async () => {
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
      const data = await response.text();
      setMessage(data);
    };

    setStarted(true);
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
      <div className="h-10 border-b-[1px] items-center px-2 flex justify-between w-full">
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
      <div className="p-3 max-w-[800px] w-[60%] grid grid-cols-2">
        <div className="col-span-1">
        {state.prompts?.map((prompt, index) => (
          <ChatMessage model={Model.FUZZER} text={prompt} />
        ))}
        </div>
        
        <div className="col-span-1">
          {state.responses?.map((response, index) => (
            <ChatMessage model={Model.MISTRAL} text={response} />
          ))}
        </div>
        
        <div>{message}</div>
      </div>
    </div>
  );
}
