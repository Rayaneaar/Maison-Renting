<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function analytics(Request $request)
    {
        $user = $request->user();

        $properties = $user->properties()->withCount('offers')->get();

        $totalViews = (int) $properties->sum('views_count');
        $totalProperties = $properties->count();
        $totalOffers = (int) $properties->sum('offers_count');

        $pendingOffers = Offer::whereHas('property', fn ($q) => $q->where('user_id', $user->id))
            ->where('status', 'pending')
            ->count();

        
        $viewsByProperty = $properties->map(fn ($p) => [
            'title' => $p->title,
            'views' => (int) $p->views_count,
            'offers' => (int) $p->offers_count,
        ])->values();

        
        $offersByStatus = Offer::whereHas('property', fn ($q) => $q->where('user_id', $user->id))
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        
        $engagementRate = $totalViews > 0 ? round(($totalOffers / $totalViews) * 100, 2) : 0;

        
        $insights = [];
        if ($totalViews > 1000 && $engagementRate < 1) {
            $insights[] = "High visibility but low engagement. Consider adjusting your pricing.";
        }
        if ($engagementRate > 5) {
            $insights[] = "Excellent engagement rate! Your properties are highly desirable.";
        }
        if ($pendingOffers > 0) {
            $insights[] = "You have $pendingOffers pending offers waiting for your response.";
        }
        if (empty($insights)) {
            $insights[] = "Your portfolio is performing steadily. Keep monitoring for new trends.";
        }

        return response()->json([
            'totals' => [
                'properties' => $totalProperties,
                'views' => $totalViews,
                'offers' => $totalOffers,
                'pending_offers' => $pendingOffers,
                'engagement_rate' => $engagementRate,
            ],
            'views_by_property' => $viewsByProperty,
            'offers_by_status' => [
                'pending' => (int) ($offersByStatus['pending'] ?? 0),
                'accepted' => (int) ($offersByStatus['accepted'] ?? 0),
                'rejected' => (int) ($offersByStatus['rejected'] ?? 0),
            ],
            'insights' => $insights,
        ]);
    }
}
