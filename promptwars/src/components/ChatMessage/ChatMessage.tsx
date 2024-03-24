import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export enum Model {
    FUZZER = "fuzzer",
    MISTRAL = "mistral", 
    SCORE = "score"
}

export interface ChatMessageProps {
  model: Model;
  text: string;
  target: string;
}

export const ChatMessage = ({ model, text, target }: ChatMessageProps) => {

const textSplit = text.split(target);
const avatarSrc = model === Model.MISTRAL ? "/mistral.png" : "/fuzzy.png"
  return (
  <div className="grid grid-cols-12 py-2">
      <Avatar className="border-[3px] col-span-1">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="col-span-11 tracking-normal max-h-[400px] overflow-y-scroll whitespace-pre text-wrap">
        {textSplit.map((chunk, index) => (
          <>
          {chunk}
          {index < textSplit.length - 1 && (<b className="text-red-600 font-bold">{target}</b>)}
          </>
        ))}
      </div>
    </div>
  );
};
