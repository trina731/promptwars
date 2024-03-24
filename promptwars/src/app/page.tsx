'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [target, setTarget] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white  ">
      <div className="justify-center items-center flex flex-col gap-y-5">
        <img src="/fuzzy.png" alt="fuzzy" className="bg-transparent"/>
        <div className="text-3xl font-mono">PROMPT WARS</div>
        <Input
          className="bg-slate-100"
          placeholder="Enter target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              window.location.href = `/war?target=${target}`;
            }
          }}
        />
        <Button onClick={() => (window.location.href = `/war?target=${target}`)}>Generate</Button>
      </div>
    </main>
  );
}
