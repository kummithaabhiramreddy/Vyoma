import React from "react";

const GRADIENTS = [
  "linear-gradient(135deg,#FF8A3D,#FFC371)",
  "linear-gradient(135deg,#4FD1C5,#2C7A9C)",
  "linear-gradient(135deg,#7F7FD5,#86A8E7)",
  "linear-gradient(135deg,#FF6B6B,#FFA36B)",
  "linear-gradient(135deg,#43CBFF,#9708CC)",
  "linear-gradient(135deg,#F6D365,#FDA085)",
];

function hashCode(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i) | 0;
  return h;
}

export default function Avatar({ seed = "u", name = "?", size = 40, photoURL }) {
  if (photoURL) {
    return (
      <img
        src={photoURL} alt={name} width={size} height={size}
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const bg = GRADIENTS[Math.abs(hashCode(seed)) % GRADIENTS.length];
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Sora, sans-serif", fontWeight: 700, color: "#0E1224",
        fontSize: size * 0.36, flexShrink: 0,
      }}
    >
      {initials || "?"}
    </div>
  );
}