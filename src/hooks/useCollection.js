import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

/**
 * Subscribes to any Firestore query in real time.
 * Usage: const { docs, loading } = useCollection(query(collection(db,"posts"), orderBy("createdAt","desc")))
 */
export function useCollection(firestoreQuery) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestoreQuery) return;
    const unsub = onSnapshot(
      firestoreQuery,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("useCollection error:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, [firestoreQuery]);

  return { docs, loading };
}