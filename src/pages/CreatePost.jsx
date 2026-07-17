import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft } from "lucide-react";

export default function CreatePost() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      let imageURL = "";
      if (file) {
        try {
          const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          imageURL = await getDownloadURL(storageRef);
        } catch (storageErr) {
          // Firebase Storage not available (free plan) — post without image
          console.warn("Image upload skipped (Storage not enabled):", storageErr.message);
          alert("⚠️ Image upload is not available yet. Your post will be shared as text only.");
          imageURL = "";
        }
      }
      await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        authorHandle: profile?.handle || "you",
        authorName: profile?.name || "You",
        authorPhoto: profile?.photoURL || "",
        caption,
        imageURL,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-16">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <ChevronLeft size={20} onClick={() => navigate(-1)} className="cursor-pointer" />
        <span className="font-display font-semibold text-sm">New post</span>
      </header>

      <form onSubmit={submit} className="p-4">
        <label className="block w-full aspect-square bg-surface2 border border-border rounded-xl mb-4 flex items-center justify-center overflow-hidden cursor-pointer">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-dim text-sm">Tap to choose a photo</span>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>

        <textarea
          value={caption} onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..." rows={3}
          className="w-full bg-surface2 border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none mb-4 resize-none"
        />

        <button
          disabled={busy || (!file && !caption.trim())}
          className="w-full bg-gradient-to-r from-accent to-orange-300 text-[#1A1204] font-display font-bold text-sm py-3 rounded-lg disabled:opacity-50"
        >
          {busy ? "Sharing..." : "Share"}
        </button>
      </form>
    </div>
  );
}