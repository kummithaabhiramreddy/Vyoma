import React from "react";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { LogOut, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const q = query(collection(db, "posts"), where("authorId", "==", user.uid), orderBy("createdAt", "desc"));
  const { docs: posts } = useCollection(q);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="pb-16">
      <div className="flex items-center gap-5 px-4 py-5">
        <Avatar seed={user.uid} name={profile?.name || "You"} photoURL={profile?.photoURL} size={76} />
        <div className="flex gap-5">
          <Stat n={posts.length} label="Posts" />
          <Stat n={profile?.followers?.length || 0} label="Followers" />
          <Stat n={profile?.following?.length || 0} label="Following" />
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="font-display font-bold text-sm">{profile?.name}</div>
        <div className="text-dim text-[13px] mt-0.5">{profile?.bio || "New here — finding my altitude."}</div>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-surface border border-border rounded-lg py-2.5 text-sm font-display font-semibold"
        >
          <LogOut size={15} /> Log out
        </button>
      </div>

      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((p) => (
          <div key={p.id} className="aspect-square bg-surface2">
            {p.imageURL ? (
              <img src={p.imageURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Plane size={20} className="text-dim rotate-45" /></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-base">{n}</div>
      <div className="text-[11.5px] text-dim">{label}</div>
    </div>
  );
}