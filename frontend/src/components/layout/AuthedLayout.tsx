import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { get, post, put } from "@/lib/api";
import { ChevronsLeft, ChevronsRight, Code2, LayoutDashboard, User, Bell, Settings, Menu, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Identicon from "@/components/ui/identicon";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

type Props = {
  children: React.ReactNode;
};

export default function AuthedLayout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('layout_sidebar_collapsed') === '1'; } catch { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('layout_sidebar_collapsed', collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  // Preferences (Sheet)
  const [prefOpen, setPrefOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    try { return (localStorage.getItem('pref_theme') as 'light' | 'dark') || 'light'; } catch { return 'light'; }
  });
  const [emailNotif, setEmailNotif] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try { return localStorage.getItem('pref_email_notif') !== '0'; } catch { return true; }
  });
  const [pushNotif, setPushNotif] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('pref_push_notif') === '1'; } catch { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('pref_theme', theme); } catch {}
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);
  React.useEffect(() => { try { localStorage.setItem('pref_email_notif', emailNotif ? '1' : '0'); } catch {} }, [emailNotif]);
  React.useEffect(() => { try { localStorage.setItem('pref_push_notif', pushNotif ? '1' : '0'); } catch {} }, [pushNotif]);

  // Load preferences from API on mount
  const [prefsLoaded, setPrefsLoaded] = React.useState(false);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await get<{ preferences: { theme?: 'light' | 'dark'; email_notifications?: boolean; push_notifications?: boolean } }>("/api/preferences");
        if (mounted && res.ok && res.data && (res.data as any).preferences) {
          const p = (res.data as any).preferences;
          if (p.theme) setTheme(p.theme);
          if (typeof p.email_notifications === 'boolean') setEmailNotif(p.email_notifications);
          if (typeof p.push_notifications === 'boolean') setPushNotif(p.push_notifications);
        }
      } finally {
        if (mounted) setPrefsLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Persist preferences to API on change
  React.useEffect(() => {
    if (!prefsLoaded) return;
    (async () => {
      try {
        await put("/api/preferences", {
          theme,
          email_notifications: emailNotif,
          push_notifications: pushNotif,
        });
      } catch {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer les préférences." });
      }
    })();
  }, [theme, emailNotif, pushNotif, prefsLoaded]);

  const name = (user as any)?.name as string | undefined;
  const email = (user as any)?.email as string | undefined;
  const initials = (name || email || "U").slice(0, 2).toUpperCase();

  const onLogout = async () => {
    try {
      await get("/sanctum/csrf-cookie");
      await post("/api/logout");
      toast({ title: "Déconnexion", description: "Vous avez été déconnecté." });
    } catch {
      toast({ variant: "destructive", title: "Erreur réseau", description: "Déconnexion locale effectuée." });
    }
    setUser(null);
    navigate("/", { replace: true });
  };

  const nav: Array<{ to: string; label: string; icon: React.ComponentType<{ className?: string }>; }> = [
    { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/profile", label: "Profil", icon: User },
    { to: "/settings", label: "Préférences", icon: Settings },
  ];

  // Email verification banner state
  const verified = Boolean((user as any)?.email_verified_at);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [resendStatus, setResendStatus] = React.useState<string | null>(null);
  const [resendError, setResendError] = React.useState<string | null>(null);

  const resendVerification = async () => {
    setResendStatus(null);
    setResendError(null);
    setResendLoading(true);
    try {
      await get("/sanctum/csrf-cookie");
      const res = await post("/api/email/verification-notification");
      if (!res.ok) {
        const msg = (res.data as any)?.message || "Impossible d'envoyer l'e-mail de vérification";
        setResendError(msg);
        toast({ variant: "destructive", title: "Erreur", description: msg });
      } else {
        setResendStatus("Lien de vérification envoyé.");
        toast({ title: "Succès", description: "Lien de vérification envoyé." });
      }
    } catch {
      setResendError("Erreur réseau");
      toast({ variant: "destructive", title: "Erreur réseau", description: "Veuillez réessayer." });
    } finally {
      setResendLoading(false);
    }
  };

  type DBNotif = { id: string; data: any; created_at: string; read_at: string | null };
  const [notifications, setNotifications] = React.useState<DBNotif[]>([]);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const refreshNotifications = React.useCallback(async () => {
    try {
      const res = await get<{ data: DBNotif[]; unread_count: number }>(`/api/notifications?limit=10`);
      if (res.ok && res.data) {
        const payload: any = res.data;
        setNotifications(payload.data || []);
        setUnreadCount(payload.unread_count || 0);
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les notifications." });
    }
  }, []);

  const markAllRead = React.useCallback(async () => {
    try {
      await post(`/api/notifications/read-all`);
      await refreshNotifications();
      toast({ title: "Notifications", description: "Toutes marquées comme lues." });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de marquer comme lues." });
    }
  }, [refreshNotifications]);

  const markOneRead = React.useCallback(async (id: string) => {
    try {
      await post(`/api/notifications/${id}/read`);
      await refreshNotifications();
      toast({ title: "Notification", description: "Marquée comme lue." });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de marquer la notification comme lue." });
    }
  }, [refreshNotifications]);

  React.useEffect(() => {
    if (notifOpen) {
      refreshNotifications();
    }
  }, [notifOpen, refreshNotifications]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className={`hidden md:flex ${collapsed ? "md:w-16" : "md:w-64"} flex-col border-r border-border bg-secondary/50` }>
        <div className="h-14 flex items-center px-4 font-semibold tracking-wide">
          {collapsed ? (
            <Code2 className="h-5 w-5 mx-auto" />
          ) : (
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              <span>DevFolio</span>
            </div>
          )}
        </div>
        <nav className="flex-1 px-2 py-2 space-y-1">
          {nav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center rounded-md px-3 py-2 text-sm gap-2 " +
                  (collapsed ? "justify-center " : " ") +
                  (active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground")
                }
                onClick={(e) => {
                  if (item.to === "/settings") {
                    e.preventDefault();
                    setPrefOpen(true);
                  }
                }}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="px-4 py-3 text-xs text-muted-foreground">
            {user?.email || ""}
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* Mobile: Hamburger to open drawer */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary" aria-label="Ouvrir le menu">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <div className="h-14 flex items-center px-4 font-semibold tracking-wide border-b"> 
                    <Code2 className="h-5 w-5 mr-2" /> DevFolio
                  </div>
                  <nav className="px-2 py-2 space-y-1">
                    {nav.map((item) => {
                      const active = location.pathname.startsWith(item.to);
                      const Icon = item.icon;
                      return (
                        <SheetClose asChild key={item.to}>
                          <Link
                            to={item.to}
                            className={
                              "flex items-center rounded-md px-3 py-2 text-sm gap-2 " +
                              (active ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground")
                            }
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                  <div className="px-4 py-3 text-xs text-muted-foreground border-t">{user?.email || ""}</div>
                </SheetContent>
              </Sheet>
            </div>
            {/* Desktop: Collapse toggle */}
            <button
              className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Basculer la barre latérale"
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <ChevronsLeft className="h-4 w-4" />
              )}
            </button>
            <div className="md:hidden font-semibold">DevFolio</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Topbar icons */}
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[1rem] rounded-full bg-destructive text-destructive-foreground text-[10px] leading-4 px-1 text-center">{unreadCount}</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">Notifications</div>
                  <button className="text-xs underline" onClick={markAllRead}>Tout marquer comme lu</button>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Aucune notification pour le moment.</div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => {
                      const title = n.data?.title || n.data?.subject || 'Notification';
                      const desc = n.data?.message || n.data?.body || n.data?.description || '';
                      const created = new Date(n.created_at);
                      const time = isNaN(created.getTime()) ? n.created_at : created.toLocaleString();
                      const unread = !n.read_at;
                      return (
                        <div key={n.id} className="rounded border p-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{time}</span>
                            {unread ? (
                              <button className="underline" onClick={() => markOneRead(n.id)}>Marquer comme lu</button>
                            ) : (
                              <span className="text-[10px] uppercase tracking-wide">Lu</span>
                            )}
                          </div>
                          <p className="font-medium text-sm">{title}</p>
                          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-3 text-right">
                  <Link to="/notifications" className="text-xs underline">Tout voir</Link>
                </div>
              </PopoverContent>
            </Popover>
            {email && (
              <div className="hidden sm:block text-sm text-muted-foreground truncate max-w-[200px]">
                {email}
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-secondary focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(user as any)?.avatar_url || ""} alt={name || email || "User"} />
                    <AvatarFallback className="bg-transparent p-0">
                      <Identicon value={email || name || "user"} size={32} />
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>Tableau de bord</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>Profil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPrefOpen(true)}>Préférences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={prefOpen} onOpenChange={setPrefOpen}>
              <SheetContent side="right" className="w-[360px] sm:max-w-[420px]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Préférences</h3>
                    <p className="text-xs text-muted-foreground">Personnalisez votre expérience.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Theme</p>
                        <p className="text-xs text-muted-foreground">Basculer le mode sombre</p>
                      </div>
                      <Switch checked={theme === 'dark'} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notifications par e-mail</p>
                        <p className="text-xs text-muted-foreground">Recevoir des emails pour les activités importantes</p>
                      </div>
                      <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notifications push</p>
                        <p className="text-xs text-muted-foreground">Activer les notifications navigateur</p>
                      </div>
                      <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        {!verified && (
          <div className="px-4">
            <div className="mb-2 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-900 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm">Votre adresse e-mail n'est pas vérifiée. Veuillez vérifier pour sécuriser votre compte.</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resendVerification}
                    disabled={resendLoading}
                    className="text-xs rounded-md border px-2 py-1 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    {resendLoading && <Loader2 className="mr-1 h-3 w-3 inline animate-spin" />} {resendLoading ? "Envoi..." : "Renvoyer l'e-mail de vérification"}
                  </button>
                  <Link to="/verify-email" className="text-xs underline">Voir les instructions</Link>
                </div>
              </div>
              
              
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
