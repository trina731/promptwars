"use client";

import { ChatMessage, Model } from "@/components/ChatMessage/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
export default function Home() {
  const [target, setTarget] = useState(
    new URLSearchParams(window.location.search).get("target") || ""
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    const start = async () => {
       const payload = {};
        const response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
      const data = await response.text();
      setMessage(data);
    }

    start();


  }, [target]);

  const [model, setModel] = useState<Model>();

  return (
    <div className="flex flex-col items-center">
      <div className="h-10 border-b-[1px] items-center px-2 flex justify-between w-full">
        <span className="flex flex-row items-center gap-x-3">
          <img src="/fuzzy.png" alt="fuzzy" className="bg-transparent h-4" />
          <span>PROMPT WARS</span>
        </span>
        <div className="flex flex-row justify-center items-center">
          <span><span className="italic mr-1">Generating things for</span><span className="font-semibold">{target}</span></span>
        </div>

        <a className="flex flex-row items-center cursor-pointer" href="/">
          Return to home <ArrowRightIcon className="h-3" />
        </a>
      </div>
      <div className="p-3 max-w-[800px] w-[60%]">
        <ChatMessage model={Model.FUZZER} />
        <ChatMessage model={Model.MISTRAL} />
        <div>{message}</div>
      </div>
    </div>
  );
}
