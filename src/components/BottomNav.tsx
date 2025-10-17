import { Heart, Home, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function BottomNav({
  active,
}: {
  active: "home" | "consult" | "log";
}) {
  const base = "flex flex-col items-center gap-1 text-xs font-medium";
  const activeClass = "text-violet-600";
  const inactiveClass = "text-gray-400";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md justify-around py-2">
        <Link
          href="/"
          className={`${base} ${active === "home" ? activeClass : inactiveClass}`}
        >
          <Home size={24} />
          <span>Beranda</span>
        </Link>
        <Link
          href="/consult"
          className={`${base} ${active === "consult" ? activeClass : inactiveClass}`}
        >
          <Stethoscope size={24} />
          <span>Consult</span>
        </Link>
        <Link
          href="/log"
          className={`${base} ${active === "log" ? activeClass : inactiveClass}`}
        >
          <Heart size={24} />
          <span>Log</span>
        </Link>
      </div>
    </nav>
  );
}
