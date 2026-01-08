import React from "react";
import AuthedLayout from "@/components/layout/AuthedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { get, post } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type DBNotif = { id: string; data: any; created_at: string; read_at: string | null };

export default function Notifications() {
  const [items, setItems] = React.useState<DBNotif[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [markingAll, setMarkingAll] = React.useState(false);
  const [markingIds, setMarkingIds] = React.useState<Set<string>>(new Set());

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await get<{ data: DBNotif[] }>("/api/notifications?limit=50");
      if (res.ok && res.data) {
        setItems((res.data as any).data || []);
      }
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les notifications." });
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllRead = React.useCallback(async () => {
    try {
      setMarkingAll(true);
      await post("/api/notifications/read-all");
      toast({ title: "Notifications", description: "Toutes marquées comme lues." });
      await refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de marquer comme lues." });
    } finally {
      setMarkingAll(false);
    }
  }, [refresh]);

  const markOneRead = React.useCallback(async (id: string) => {
    try {
      setMarkingIds((prev) => new Set(prev).add(id));
      await post(`/api/notifications/${id}/read`);
      toast({ title: "Notification", description: "Marquée comme lue." });
      await refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de marquer la notification comme lue." });
    } finally {
      setMarkingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [refresh]);

  React.useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button size="sm" onClick={markAllRead} disabled={markingAll || loading}>
              {markingAll && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark all as read
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notifications yet.</p>
            ) : (
              <div className="space-y-3">
                {items.map((n) => {
                  const title = n.data?.title || n.data?.subject || 'Notification';
                  const desc = n.data?.message || n.data?.body || n.data?.description || '';
                  const created = new Date(n.created_at);
                  const time = isNaN(created.getTime()) ? n.created_at : created.toLocaleString();
                  const unread = !n.read_at;
                  return (
                    <div key={n.id} className="rounded border p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{time}</span>
                        {unread ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => markOneRead(n.id)}
                            disabled={markingIds.has(n.id)}
                          >
                            {markingIds.has(n.id) && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            Mark read
                          </Button>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wide">Read</span>
                        )}
                      </div>
                      <p className="font-medium text-sm">{title}</p>
                      {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthedLayout>
  );
}
