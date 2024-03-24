import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export enum Model {
    FUZZER = "fuzzer",
    MISTRAL = "mistral", 
}

export interface ChatMessageProps {
  model: Model;
}

export const ChatMessage = ({ model }: ChatMessageProps) => {

const avatarSrc = model === Model.MISTRAL ? "/mistral.png" : "/fuzzy.png"
  return (
    <div className="border-y-[1px] grid grid-cols-12 py-2">
      <Avatar className="border-[3px] col-span-1">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="col-span-11">
        Here is the message from {model===Model.MISTRAL ? "MISTRAL" : "FUZZER"}
      </div>
    </div>
  );
};
