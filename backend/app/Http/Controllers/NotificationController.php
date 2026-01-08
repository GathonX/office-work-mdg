<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $limit = (int) ($request->query('limit', 20));
        $onlyUnread = filter_var($request->query('unread', false), FILTER_VALIDATE_BOOLEAN);

        $query = $user->notifications()->orderByDesc('created_at');
        if ($onlyUnread) {
            $query->whereNull('read_at');
        }
        $items = $query->limit($limit)->get();
        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'data' => $items,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        /** @var DatabaseNotification|null $n */
        $n = $request->user()->notifications()->where('id', $id)->first();
        if (! $n) {
            return response()->json(['message' => 'Not found'], 404);
        }
        if (! $n->read_at) {
            $n->markAsRead();
        }
        return response()->json(['message' => 'ok']);
    }

    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'ok']);
    }
}
