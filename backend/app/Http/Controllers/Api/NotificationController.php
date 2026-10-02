<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Voir les notifications de l'utilisateur connecté
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $notifications = Notification::where(
            'user_id',
            $request->user()->id
        )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'notifications' => $notifications,

            // Nombre de notifications non lues
            'unread_count' => $notifications
                ->where('read', false)
                ->count(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Marquer une notification comme lue
    |--------------------------------------------------------------------------
    */

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'message' => 'Notification introuvable.'
            ], 404);
        }

        $notification->update([
            'read' => true,
        ]);

        return response()->json([
            'message' => 'Notification marquée comme lue.',
            'notification' => $notification,
        ]);
    }
}
