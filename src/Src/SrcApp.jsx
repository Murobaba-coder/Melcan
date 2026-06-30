import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wxlzdvwrkvidrsqpcepn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bHpkdndya3ZpZHJzcXBjZXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NTE2NDksImV4cCI6MjA5ODMyNzY0OX0.y46YqI5-3AtRMUB3K2QE7Bb9OGsIJ1IT23aCGVDkPD8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const COLORS = ["#7C3AED","#2563EB","#059669","#DC2626","#D97706","#DB2777","#0891B2"];

function getColor(str) {
  if (!str) return COLORS[0];
  return COLORS[str.charCodeAt(0) % COLORS.length];
}

function Avatar({ profile, size = 40, showOnline = false }) {
  const color = getColor(profile?.username);
  const initials = (profile?.avatar || profile?.full_name || profile?.username || "?").substring(0, 2).toUpperCase();
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 700, fontSize: size * 0.35,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>{initials}</div>
      {showOnline && <div style={{
        position: "absolute", bottom: 2, right: 2,
        width: size * 0.28, height: size * 0.28, borderRadius: "50%",
        background: "#22C55E", border: "2px solid #0f0f17"
      }} />}
    </div>
  );
}

// â”€â”€â”€ GÄ°RÄ°Å EKRANI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit() {
    setError(""); setSuccess(""); setLoading(true);
    try {
      if (mode === "register") {
        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, username } }
        });
        if (err) throw err;
        // Profil oluÅŸtur
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username: username || email.split("@")[0],
            full_name: fullName || email.split("@")[0],
            avatar: (fullName || email).substring(0, 2).toUpperCase(),
            bio: "MelCAN kullanÄ±cÄ±sÄ± âœ¨"
          });
        }
        setSuccess("KayÄ±t baÅŸarÄ±lÄ±! GiriÅŸ yapÄ±lÄ±yor...");
        setTimeout(() => onAuth(data.user), 1000);
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onAuth(data.user);
      }
    } catch (e) {
      setError(e.message === "Invalid login credentials" ? "E-posta veya ÅŸifre hatalÄ±!" :
               e.message === "User already registered" ? "Bu e-posta zaten kayÄ±tlÄ±!" :
               e.message);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f17",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: 20
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 16px",
            background: "linear-gradient(135deg, #7C3AED, #2563EB)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, fontWeight: 900, color: "#fff",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)"
          }}>M</div>
          <div style={{ fontSize: 32, fontWeight: 900, background: "linear-gradient(135deg, #7C3AED, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MelCAN</div>
          <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>Sosyal medya platformun</div>
        </div>

        {/* Kart */}
        <div style={{ background: "#1a1a2e", borderRadius: 20, padding: 28, border: "1px solid #2a2a3e" }}>
          {/* Tab */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }} style={{
                flex: 1, background: mode === m ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "transparent",
                border: mode === m ? "none" : "1px solid #2a2a3e",
                borderRadius: 10, padding: "10px", color: mode === m ? "#fff" : "#888",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}>{m === "login" ? "GiriÅŸ Yap" : "KayÄ±t Ol"}</button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "register" && <>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ad Soyad"
                style={{ background: "#0f0f17", border: "1px solid #2a2a3e", borderRadius: 12, padding: "12px 16px", color: "#e0e0e0", fontSize: 14, fontFamily: "system-ui", outline: "none", width: "100%", boxSizing: "border-box" }} />
              <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))} placeholder="KullanÄ±cÄ± adÄ± (Ã¶rn: ayse_k)"
                style={{ background: "#0f0f17", border: "1px solid #2a2a3e", borderRadius: 12, padding: "12px 16px", color: "#e0e0e0", fontSize: 14, fontFamily: "system-ui", outline: "none", width: "100%", boxSizing: "border-box" }} />
            </>}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" type="email"
              style={{ background: "#0f0f17", border: "1px solid #2a2a3e", borderRadius: 12, padding: "12px 16px", color: "#e0e0e0", fontSize: 14, fontFamily: "system-ui", outline: "none", width: "100%", boxSizing: "border-box" }} />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Åifre" type="password"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ background: "#0f0f17", border: "1px solid #2a2a3e", borderRadius: 12, padding: "12px 16px", color: "#e0e0e0", fontSize: 14, fontFamily: "system-ui", outline: "none", width: "100%", boxSizing: "border-box" }} />
          </div>

          {error && <div style={{ color: "#EF4444", fontSize: 13, marginTop: 10, textAlign: "center" }}>{error}</div>}
          {success && <div style={{ color: "#22C55E", fontSize: 13, marginTop: 10, textAlign: "center" }}>{success}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", marginTop: 20,
            background: loading ? "#333" : "linear-gradient(135deg, #7C3AED, #2563EB)",
            border: "none", borderRadius: 12, padding: "14px",
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer"
          }}>{loading ? "â³ YÃ¼kleniyor..." : mode === "login" ? "GiriÅŸ Yap" : "KayÄ±t Ol"}</button>
        </div>

        <div style={{ color: "#555", fontSize: 12, textAlign: "center", marginTop: 20 }}>
          ArkadaÅŸÄ±nla aynÄ± uygulamayÄ± kullanmak iÃ§in<br />aynÄ± linki aÃ§Ä±p kayÄ±t olmasÄ± yeterli! ğŸ‰
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ FEED â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Feed({ user, profile }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles(*), likes(user_id), comments(id, content, profiles(*))")
      .order("created_at", { ascending: false })
      .limit(30);
    setPosts(data || []);
    setLoading(false);
  }

  async function addPost() {
    if (!newPost.trim()) return;
    await supabase.from("posts").insert({ user_id: user.id, content: newPost });
    setNewPost("");
    loadPosts();
  }

  async function toggleLike(post) {
    const alreadyLiked = post.likes?.some(l => l.user_id === user.id);
    if (alreadyLiked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id });
    }
    loadPosts();
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 12px" }}>
      {/* Composer */}
      <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 16, margin: "16px 0", border: "1px solid #2a2a3e" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Avatar profile={profile} size={38} />
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Ne dÃ¼ÅŸÃ¼nÃ¼yorsun?" rows={2}
            style={{ flex: 1, background: "#0f0f17", border: "1px solid #2a2a3e", borderRadius: 12, padding: "10px 14px", color: "#e0e0e0", fontSize: 14, resize: "none", fontFamily: "system-ui", outline: "none" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={addPost} style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", border: "none", borderRadius: 10, padding: "8px 22px", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>PaylaÅŸ</button>
        </div>
      </div>

      {loading && <div style={{ color: "#555", textAlign: "center", marginTop: 40 }}>YÃ¼kleniyor...</div>}
      {posts.map(post => (
        <PostCard key={post.id} post={post} user={user} onLike={() => toggleLike(post)} onComment={loadPosts} />
      ))}
      {!loading && posts.length === 0 && (
        <div style={{ color: "#555", textAlign: "center", marginTop: 60, fontSize: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>ğŸ“­</div>
          HenÃ¼z gÃ¶nderi yok. Ä°lk gÃ¶nderiyi sen yap!
        </div>
      )}
    </div>
  );
}

function PostCard({ post, user, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const alreadyLiked = post.likes?.some(l => l.user_id === user.id);

  async function addComment() {
    if (!commentText.trim()) return;
    await supabase.from("comments").insert({ user_id: user.id, post_id: post.id, content: commentText });
    setCommentText("");
    onComment();
  }

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts);
    const m = Math.floor(diff / 60000);
    if (m < 1) return "ÅŸimdi";
    if (m < 60) return `${m}dk`;
    if (m < 1440) return `${Math.floor(m/60)}sa`;
    return `${Math.floor(m/1440)}g`;
  };

  return (
    <div style={{ background: "#1a1a2e", borderRadius: 16, marginBottom: 16, border: "1px solid #2a2a3e", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar profile={post.profiles} size={40} showOnline />
          <div>
            <div style={{ color: "#e0e0e0", fontWeight: 600, fontSize: 14 }}>{post.profiles?.full_name || post.profiles?.username}</div>
            <div style={{ color: "#666", fontSize: 12 }}>@{post.profiles?.username} Â· {timeAgo(post.created_at)}</div>
          </div>
        </div>
        <div style={{ color: "#d0d0d0", fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>{post.content}</div>
        <div style={{ display: "flex", gap: 20, paddingTop: 12, borderTop: "1px solid #2a2a3e" }}>
          <button onClick={onLike} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: alreadyLiked ? "#EF4444" : "#888", fontSize: 13 }}>
            <span style={{ fontSize: 17 }}>{alreadyLiked ? "â¤ï¸" : "ğŸ¤"}</span> {post.likes?.length || 0}
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13 }}>
            <span style={{ fontSize: 17 }}>ğŸ’¬</span> {post.comments?.length || 0}
          </button>
        </div>
      </div>
      {showComments && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #2a2a3e" }}>
          {post.comments?.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "flex-start" }}>
              <Avatar profile={c.profiles} size={28} />
              <div style={{ background: "#0f0f17", borderRadius: 10, padding: "6px 10px", flex: 1 }}>
                <div style={{ color: "#7C3AED", fontSize: 11, fontWeight: 600 }}>{c.profiles?.full_name || c.profiles?.username}</div>
                <div style={{ color: "#ccc", fontSize: 13 }}>{c.content}</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Avatar profile={post.profiles} size={28} />
            <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} placeholder="Yorum yaz..."
              style={{ flex: 1, background: "#0f0f17", border: "1px solid #2a2a3e", borderRadius: 10, padding: "6px 12px", color: "#e0e0e0", fontSize: 13, fontFamily: "system-ui", outline: "none" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ ARKADAÅLAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Friends({ user }) {
  const [allUsers, setAllUsers] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("find");

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const { data: users } = await supabase.from("profiles").select("*").neq("id", user.id);
    const { data: fs } = await supabase.from("friendships").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
    setAllUsers(users || []);
    setFriendships(fs || []);
  }

  function getStatus(profileId) {
    const f = friendships.find(f => (f.sender_id === user.id && f.receiver_id === profileId) || (f.receiver_id === user.id && f.sender_id === profileId));
    if (!f) return "none";
    if (f.status === "accepted") return "friends";
    if (f.sender_id === user.id) return "sent";
    return "received";
  }

  async function sendRequest(receiverId) {
    await supabase.from("friendships").insert({ sender_id: user.id, receiver_id: receiverId, status: "pending" });
    loadAll();
  }

  async function acceptRequest(senderId) {
    await supabase.from("friendships").update({ status: "accepted" }).eq("sender_id", senderId).eq("receiver_id", user.id);
    loadAll();
  }

  async function removeFriend(profileId) {
    await supabase.from("friendships").delete().or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`);
    loadAll();
  }

  const filtered = allUsers.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()));
  const myFriends = allUsers.filter(u => getStatus(u.id) === "friends");
  const incoming = allUsers.filter(u => getStatus(u.id) === "received");

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 12px" }}>
      <div style={{ paddingTop: 16, marginBottom: 16 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>ArkadaÅŸlar</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }}>
          {[["find","ArkadaÅŸ Bul"], ["myfriends",`ArkadaÅŸlarÄ±m (${myFriends.length})`], ["requests",`Ä°stekler (${incoming.length})`]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "#1a1a2e",
              border: "1px solid #2a2a3e", borderRadius: 10, padding: "8px 14px",
              color: view === v ? "#fff" : "#888", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
            }}>{label}</button>
          ))}
        </div>

        {view === "find" && <>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#666" }}>ğŸ”</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ä°sim veya kullanÄ±cÄ± adÄ± ara..."
              style={{ width: "100%", background: "#1a1a2e", border: "1px solid #2a2a3e", borderRadius: 14, padding: "12px 16px 12px 42px", color: "#e0e0e0", fontSize: 14, fontFamily: "system-ui", outline: "none", boxSizing: "border-box" }} />
          </div>
          {filtered.map(u => {
            const status = getStatus(u.id);
            return (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #1a1a2e" }}>
                <Avatar profile={u} size={50} showOnline />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e0e0e0", fontWeight: 600 }}>{u.full_name || u.username}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>@{u.username}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{u.bio}</div>
                </div>
                {status === "friends" && <button onClick={() => removeFriend(u.id)} style={{ background: "transparent", border: "1px solid #444", borderRadius: 10, padding: "7px 14px", color: "#888", fontSize: 12, cursor: "pointer" }}>ArkadaÅŸ âœ“</button>}
                {status === "sent" && <button style={{ background: "transparent", border: "1px solid #2a2a3e", borderRadius: 10, padding: "7px 14px", color: "#666", fontSize: 12 }}>GÃ¶nderildi</button>}
                {status === "received" && <button onClick={() => acceptRequest(u.id)} style={{ background: "linear-gradient(135deg, #059669, #065f46)", border: "none", borderRadius: 10, padding: "7px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Kabul Et âœ“</button>}
                {status === "none" && <button onClick={() => sendRequest(u.id)} style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)", border: "none", borderRadius: 10, padding: "7px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Ekle</button>}
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ color: "#555", textAlign: "center", marginTop: 40 }}>KullanÄ±cÄ± bulunamadÄ±</div>}
        </>}

        {view === "myfriends" && (myFriends.length === 0 ? (
          <div style={{ textAlign: "center", color: "#555", marginTop: 60 }}>
            <div style={
