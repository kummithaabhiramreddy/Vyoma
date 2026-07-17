import React, { useState } from "react";
import { collection, query, orderBy, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import StoryBar from "../components/StoryBar";
import StoryViewer from "../components/StoryViewer";
import { Link } from "react-router-dom";
import { PlusSquare } from "lucide-react";

export default function Feed() {
  const { profile } = useAuth();
  const [openStory, setOpenStory] = useState(null);

  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const { docs: posts, loading: postsLoading } = useCollection(postsQuery);

  // stories from the last 24h
  const dayAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const storiesQuery = query(
    collection(db, "stories"),
    where("createdAt", ">", dayAgo),
    orderBy("createdAt", "desc")
  );
  const { docs: stories } = useCollection(storiesQuery);

  return (
    <div className="pb-16">
      <StoryBar
        stories={stories}
        meProfile={profile}
        onOpenStory={setOpenStory}
        onAddStory={() => alert("Wire this to your story-upload flow (Storage upload + Firestore doc in 'stories').")}
      />

      <div className="flex justify-end px-4 py-2">
        <Link to="/create" className="flex items-center gap-1.5 text-accent2 text-xs font-display font-semibold">
          <PlusSquare size={15} /> New post
        </Link>
      </div>

      {postsLoading && <div className="text-center text-dim text-sm py-10">Loading feed...</div>}
      {!postsLoading && posts.length === 0 && (
        <div className="text-center text-dim text-sm py-10 px-6">
          No posts yet. Be the first to take off — create a post.
        </div>
      )}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}

      {openStory && <StoryViewer story={openStory} onClose={() => setOpenStory(null)} />}
    </div>
  );
}