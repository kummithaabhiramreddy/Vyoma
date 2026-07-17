import React, { useEffect, useState } from "react";
import { X, Plane } from "lucide-react";
import Avatar from "./Avatar";

export default function StoryViewer({ story, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(onClose, 150);
          return 100;
        }
        return p + 1.5;
      });
    }, 60);
    return () => clearInterval(id);
  }, [story, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-80 h-[560px] rounded-2xl overflow-hidden relative bg-surface2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/30 rounded-full">
          <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="absolute top-[18px] left-3 flex items-center gap-2">
          <Avatar seed={story.authorId} name={story.authorName} photoURL={story.authorPhoto} size={30} />
          <span className="text-white font-display font-semibold text-[13px]">{story.authorName}</span>
        </div>
        <X size={22} color="#fff" className="absolute top-[18px] right-3 cursor-pointer" onClick={onClose} />
        {story.imageURL ? (
          <img src={story.imageURL} alt="" className="w-full h-full object-cover" />
        ) : (
          <Plane size={54} className="text-white/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
        )}
      </div>
    </div>
  );
}