"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { QrCode, LogIn, User } from "lucide-react";
import "./TopBar.scss";

interface Profile {
  username: string;
  email: string;
  role: string;
}

const TopBar: FC = () => {
  const [user, setUser] = useState<Profile | null>(null);

  const loadUserFromStorage = () => {
    const raw = localStorage.getItem("user");

    if (!raw) {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();

    const handleAuthChange = () => loadUserFromStorage();
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <div id="TopBar">
      <div className="container">
        <div className="TopBar">
          <div className="TopBar__actions">
            <Link
              href="/qr_login"
              className="TopBar__btn TopBar__btn--secondary"
            >
              <QrCode size={18} />
              <span>БОРБОР — QR ВХОД</span>
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="TopBar__btn TopBar__btn--primary"
              >
                <User size={18} />
                <span>{user.username}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="TopBar__btn TopBar__btn--primary"
              >
                <LogIn size={18} />
                <span>ВОЙТИ</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
