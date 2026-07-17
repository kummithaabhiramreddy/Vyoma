import React from "react";
import { PlusSquare } from "lucide-react";
import Avatar from "./Avatar";

export default function StoryBar({ stories, meProfile, onOpenStory, onAddStory }) {
  return (
    <div className="flex gap-4 px-4 py-3.5 overflow-x-auto border-b border-border">
      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
        <div className="relative cursor-pointer" onClick={onAddStory}>
          <Avatar seed="me" name={meProfile?.name || "You"} photoURL={meProfile?.photoURL} size={58} />
          <div className="absolute -bottom-0.5 -right-0.5 bg-accent rounded-full w-[18px] h-[18px] flex items-center justify-center border-2 border-bg">
            <PlusSquare size={11} color="#1A1204" />
          </div>
        </div>
        <span className="text-[11px] text-dim">Your story</span>
      </div>

      {stories.map((s) => (
        <div key={s.id} onClick={() => onOpenStory(s)} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
          <div className="p-[3px] rounded-full" style={{ background: "linear-gradient(135deg,#FF8A3D,#4FD1C5)" }}>
            <div className="bg-bg p-[2px] rounded-full">
              <Avatar seed={s.authorId} name={s.authorName} photoURL={s.authorPhoto} size={50} />
            </div>
          </div>
          <span className="text-[11px] text-dim max-w-[60px] truncate">{s.authorName?.split(" ")[0]}</span>
        </div>
      ))}
    </div>
  );
}