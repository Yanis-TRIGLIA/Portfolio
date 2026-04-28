<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    public function index()
    {
        $visitors = Visitor::orderBy('last_visited_at', 'desc')->get();
        return response()->json($visitors);
    }

    public function track(Request $request)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        $visitor = Visitor::where('ip', $ip)->first();

        if ($visitor) {
            $visitor->update([
                'last_visited_at' => now(),
                'visit_count' => $visitor->visit_count + 1,
                'user_agent' => $userAgent,
            ]);
        } else {
            // Géolocalisation via ip-api.com (gratuit, sans clé)
            $geo = $this->getGeoLocation($ip);

            Visitor::create([
                'ip'              => $ip,
                'country'         => $geo['country'] ?? null,
                'city'            => $geo['city'] ?? null,
                'user_agent'      => $userAgent,
                'last_visited_at' => now(),
                'visit_count'     => 1,
            ]);
        }

        return response()->json(['tracked' => true]);
    }

    private function getGeoLocation(string $ip): array
    {
        // IPs locales : pas de géoloc
        if (in_array($ip, ['127.0.0.1', '::1']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
            return ['country' => 'Local', 'city' => 'Local'];
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(3)
                ->get("http://ip-api.com/json/{$ip}?fields=country,city");
            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            // Silencieux si l'API est indisponible
        }

        return [];
    }
}
