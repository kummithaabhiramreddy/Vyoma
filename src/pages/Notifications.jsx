import React from "react";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { Heart, UserPlus, MessageSquare } from "lucide-react";

/*
  Data model: notifications/{id}
  { toUserId, fromUserId, fromName, fromHandle, fromPhoto, type: "like"|"comment"|"follow", createdAt }

  Write these from wherever the triggering action happens (liking a post,
  commenting, following) or — cleaner — from a Cloud Function that listens
  for those writes. Both approaches work; a Cloud Function keeps client
  code simpler and is the recommended production pattern.
*/

const ICONS = { like: Heart, comment: MessageSquare, follow: UserPlus };

function timeAgo(ts) {
  if (!ts?.toDate) return "now";
  const diff = (Date.now() - ts.toDate().getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function Notifications() {
  const { user } = useAuth();
  const q = query(
    collection(db, "notifications"),
    where("toUserId", "==", user.uid),
    orderBy("createdAt", "desc")
  );
  const { docs: notifs, loading } = useCollection(q);

  if (loading) return <div className="text-center text-dim text-sm py-10">Loading...</div>;
  if (notifs.length === 0) return <div className="text-center text-dim text-sm py-10 px-6">No notifications yet.</div>;

  return (
    <div className="pb-16">
      {notifs.map((n) => {
        const Icon = ICONS[n.type] || Heart;
        const label = n.type === "like" ? "liked your post" : n.type === "follow" ? "started following you" : "commented on your post";
        return (
          <div key={n.id} className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Avatar seed={n.fromUserId} name={n.fromName} photoURL={n.fromPhoto} size={38} />
            <div className="flex-1 text-[13.5px]">
              <span className="font-semibold">{n.fromHandle}</span> {label}
              <div className="text-[11px] text-dim mt-0.5">{timeAgo(n.createdAt)} ago</div>
            </div>
            <Icon size={17} className="text-accent" />
          </div>
        );
      })}
    </div>
  );
}