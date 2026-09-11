"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Profile.scss";

interface StoredUser {
  username: string;
  email: string;
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LONG_PRESS_DURATION = 800; 

export default function Profile() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (raw) {
      try {
        const parsed: StoredUser = JSON.parse(raw);
        setUser(parsed);
        setEditUsername(parsed.username);
        setEditEmail(parsed.email);
      } catch {
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  const handleEditOpen = () => {
    if (!user) return;
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditError("");
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditError("");
  };

  const handleEditSave = async () => {
    setEditError("");

    if (!editUsername.trim() || !editEmail.trim()) {
      setEditError("Аты жана email бош болбошу керек");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setEditError("Сессия аяктады, кайра кириңиз");
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUsername.trim(),
          email: editEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEditError(data.message || "Сактоодо ката кетти");
        return;
      }

      const updatedUser: StoredUser = {
        ...user!,
        username: editUsername.trim(),
        email: editEmail.trim(),
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("authChange"));

      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Профилди жаңыртууда ката:", err);
      setEditError("Backend менен байланышта ката чыкты");
    } finally {
      setIsSaving(false);
    }
  };



  const startPress = () => {
    if (!isAdminUser()) return;

    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      setIsPressing(false);
      router.push("/admin");
    }, LONG_PRESS_DURATION);
  };

  const cancelPress = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const isAdminUser = () => user?.role === "ADMIN";

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <main className="profile">
        <div className="profile__card">
          <h1 className="profile__name">Сиз системага кирген жоксуз</h1>
          <div className="profile__actions">
            <Link href="/login">
              <button>Кирүү</button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isAdmin = isAdminUser();
  const avatarLetter = user.username?.charAt(0).toUpperCase() || "?";

  return (
    <main className={`profile ${isAdmin ? "profile--admin" : ""}`}>
      <div className="profile__card">
        <div
          className={`profile__avatar ${isPressing ? "profile__avatar--pressing" : ""}`}
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
          title={isAdmin ? undefined : undefined}
        >
          {avatarLetter}
        </div>

        <h1 className="profile__name">{user.username}</h1>

        <p className="profile__email">{user.email}</p>

        {!isEditing ? (
          <>
            <div className="profile__info">
              <div className="profile__item">
                <span>Name</span>
                <strong>{user.username}</strong>
              </div>

              <div className="profile__item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="profile__item">
                <span>Role</span>
                <strong className="profile__role">
                  {isAdmin ? "Admin" : "User"}
                </strong>
              </div>
            </div>

            <div className="profile__actions">
              <button onClick={handleEditOpen}>Edit Profile</button>

              <button className="profile__logout-btn" onClick={handleLogout}>
                Чыгуу
              </button>
            </div>
          </>
        ) : (
          <div className="profile__edit-form">
            <div className="profile__edit-group">
              <label>Name</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
            </div>

            <div className="profile__edit-group">
              <label>Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>

            {editError && <p className="profile__edit-error">{editError}</p>}

            <div className="profile__actions">
              <button onClick={handleEditSave} disabled={isSaving}>
                {isSaving ? "Сакталууда..." : "Сактоо"}
              </button>
              <button onClick={handleEditCancel} disabled={isSaving}>
                Артка
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}