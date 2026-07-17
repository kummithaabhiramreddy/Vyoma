import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Plane } from "lucide-react";
import {
  doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

function timeAgo(ts) {
  if (!ts?.toDate) return "now";
  const diff = (Date.now() - ts.toDate().getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function PostCard({ post }) {
  const { user, profile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [burst, setBurst] = useState(false);
  const liked = post.likedBy?.includes(user?.uid);

  const toggleLike = async () => {
    const ref = doc(db, "posts", post.id);
    await updateDoc(ref, {
      likedBy: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const doubleLike = () => {
    if (!liked) toggleLike();
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addDoc(collection(db, "posts", post.id, "comments"), {
      text: commentText.trim(),
      authorId: user.uid,
      authorHandle: profile?.handle || "you",
      createdAt: serverTimestamp(),
    });
    setCommentText("");
    setShowComments(true);
  };

  return (
    <div className="border-b border-border pb-3 mb-1">
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar seed={post.authorId} name={post.authorName} photoURL={post.authorPhoto} size={34} />
          <div>
            <div className="font-display font-semibold text-[13.5px]">{post.authorHandle}</div>
            <div className="text-[11px] text-dim">{timeAgo(post.createdAt)} ago</div>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-dim" />
      </div>

      <div onDoubleClick={doubleLike} className="relative">
        {post.imageURL ? (
          <img src={post.imageURL} alt="" className="w-full aspect-square object-cover" />
        ) : (
          <div className="w-full aspect-square bg-surface2 flex items-center justify-center">
            <Plane size={28} className="text-dim rotate-45" />
          </div>
        )}
        {burst && (
          <Heart
            size={90} fill="#FF8A3D" color="#FF8A3D"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-like-burst"
          />
        )}
      </div>

      <div className="flex items-center gap-4 px-3.5 pt-2.5 pb-1">
        <Heart size={23} onClick={toggleLike} fill={liked ? "#FF8A3D" : "none"}
          color={liked ? "#FF8A3D" : "#F5F3ED"} className="cursor-pointer" />
        <MessageCircle size={22} className="cursor-pointer" onClick={() => setShowComments((v) => !v)} />
        <Send size={20} className="cursor-pointer" />
        <div className="flex-1" />
        <Bookmark size={20} className="cursor-pointer" />
      </div>

      <div className="px-3.5">
        <div className="font-display font-bold text-[13.5px]">{(post.likedBy?.length || 0).toLocaleString()} likes</div>
        <div className="text-[13.5px] mt-0.5 leading-snug">
          <span className="font-semibold">{post.authorHandle}</span> {post.caption}
        </div>

        {showComments && <CommentList postId={post.id} />}

        <form onSubmit={submitComment} className="flex items-center gap-2 mt-2">
          <Smile size={18} className="text-dim" />
          <input
            value={commentText} onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..." className="flex-1 bg-transparent outline-none text-[13px]"
          />
          {commentText.trim() && (
            <button type="submit" className="text-accent2 font-display font-bold text-xs">Post</button>
          )}
        </form>
      </div>
    </div>
  );
}

function CommentList({ postId }) {
  const [comments, setComments] = useState(null);
  React.useEffect(() => {
    // lazy import to avoid unused warning when comments never opened
    import("firebase/firestore").then(({ collection, query, orderBy, onSnapshot }) => {
      const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
      return onSnapshot(q, (snap) => setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    });
  }, [postId]);

  if (!comments) return <div className="text-dim text-xs mt-2">Loading comments...</div>;
  if (comments.length === 0) return <div className="text-dim text-xs mt-2">No comments yet. Be the first.</div>;

  return (
    <div className="mt-2 space-y-1">
      {comments.map((c) => (
        <div key={c.id} className="text-[13px]">
          <span className="font-semibold">{c.authorHandle}</span> {c.text}
        </div>
      ))}
    </div>
  );
}