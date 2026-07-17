import React from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { Plane } from "lucide-react";

export default function Explore() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(60));
  const { docs: posts, loading } = useCollection(q);

  if (loading) return <div className="text-center text-dim text-sm py-10">Loading...</div>;
  if (posts.length === 0) return <div className="text-center text-dim text-sm py-10 px-6">Nothing to explore yet.</div>;

  return (
    <div className="grid grid-cols-3 gap-0.5 p-0.5 pb-16">
      {posts.map((p) => (
        <div key={p.id} className="aspect-square bg-surface2">
          {p.imageURL ? (
            <img src={p.imageURL} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Plane size={22} className="text-dim rotate-45" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}