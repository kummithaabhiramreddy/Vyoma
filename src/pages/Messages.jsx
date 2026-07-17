import React, { useEffect, useRef, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp,
  doc, setDoc, getDocs, limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import { Send } from "lucide-react";

/*
  Data model:
  conversations/{conversationId}: { members: [uidA, uidB], memberInfo: {uid: {name,handle,photoURL}}, lastMessage, updatedAt }
  conversations/{conversationId}/messages/{messageId}: { senderId, text, createdAt }

  conversationId is deterministic: sorted([uidA, uidB]).join('_')
  so opening a chat with the same person always reuses the same thread.
*/

function conversationId(a, b) {
  return [a, b].sort().join("_");
}

export default function Messages() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  // live list of my conversations
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "conversations"),
      where("members", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setConversations(list);
      if (!activeId && list.length) setActiveId(list[0].id);
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // live messages for active conversation
  useEffect(() => {
    if (!activeId) return;
    const q = query(
      collection(db, "conversations", activeId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 50);
    });
    return unsub;
  }, [activeId]);

  const send = async () => {
    if (!text.trim() || !activeId) return;
    await addDoc(collection(db, "conversations", activeId, "messages"), {
      senderId: user.uid,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    await setDoc(
      doc(db, "conversations", activeId),
      { lastMessage: text.trim(), updatedAt: serverTimestamp() },
      { merge: true }
    );
    setText("");
  };

  const active = conversations.find((c) => c.id === activeId);
  const otherUid = active?.members.find((m) => m !== user.uid);
  const otherInfo = active?.memberInfo?.[otherUid];

  return (
    <div className="flex h-[calc(100vh-56px)] pb-16">
      <div className="w-[110px] border-r border-border overflow-y-auto flex-shrink-0">
        {conversations.length === 0 && (
          <p className="text-dim text-[11px] p-3 leading-snug">
            No conversations yet. Start one from someone's profile.
          </p>
        )}
        {conversations.map((c) => {
          const uid = c.members.find((m) => m !== user.uid);
          const info = c.memberInfo?.[uid];
          return (
            <div
              key={c.id} onClick={() => setActiveId(c.id)}
              className={`p-2.5 flex flex-col items-center gap-1.5 cursor-pointer ${c.id === activeId ? "bg-surface2" : ""}`}
            >
              <Avatar seed={uid} name={info?.name || "?"} photoURL={info?.photoURL} size={40} />
              <span className="text-[10.5px] text-dim text-center truncate w-full">{info?.name?.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col">
        {active ? (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
              <Avatar seed={otherUid} name={otherInfo?.name || "?"} photoURL={otherInfo?.photoURL} size={30} />
              <span className="font-display font-semibold text-[13.5px]">{otherInfo?.handle}</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`px-3.5 py-2 rounded-2xl max-w-[70%] text-[13.5px] ${
                    m.senderId === user.uid
                      ? "self-end bg-gradient-to-r from-accent to-orange-300 text-[#1A1204]"
                      : "self-start bg-surface2"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-3 border-t border-border">
              <input
                value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Message..."
                className="flex-1 bg-surface2 border border-border rounded-full px-3.5 py-2 text-[13px] outline-none"
              />
              <button onClick={send}><Send size={20} className="text-accent2" /></button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-dim text-sm px-6 text-center">
            Select a conversation, or open someone's profile and tap Message to start one.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Call this from a Profile page's "Message" button to start/open a thread.
 * Example:
 *   const id = await startConversation(currentUser, otherUserProfile);
 *   navigate(`/messages`);
 */
export async function startConversation(me, meProfile, other) {
  const id = conversationId(me.uid, other.uid);
  const existing = await getDocs(
    query(collection(db, "conversations"), where("__name__", "==", id), limit(1))
  );
  if (existing.empty) {
    await setDoc(doc(db, "conversations", id), {
      members: [me.uid, other.uid],
      memberInfo: {
        [me.uid]: { name: meProfile.name, handle: meProfile.handle, photoURL: meProfile.photoURL || "" },
        [other.uid]: { name: other.name, handle: other.handle, photoURL: other.photoURL || "" },
      },
      lastMessage: "",
      updatedAt: serverTimestamp(),
    });
  }
  return id;
}