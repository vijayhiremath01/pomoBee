import { ReactNode, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { clearToken, getToken } from "@/lib/auth";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const authed = useMemo(() => Boolean(getToken()), [location]);

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-foreground">
            pomobee
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground">
              History
            </Link>
            {authed ? (
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
