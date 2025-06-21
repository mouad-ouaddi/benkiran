<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Handle CORS preflight
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        }

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Find user by email
        $user = Utilisateur::where('email', $request->email)->first();

        // Check if user exists and password matches (no hashing)
        if ($user && $user->mot_de_passe === $request->password) {
            
            // Load related data based on role
            $userData = [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'date_creation' => $user->date_creation
            ];

            // Add role-specific data
            if ($user->role === 'adherent' && $user->adherent) {
                $userData['adherent_id'] = $user->adherent->id;
            } elseif ($user->role === 'coach' && $user->coach) {
                $userData['coach_id'] = $user->coach->id;
                $userData['specialite'] = $user->coach->specialite;
                $userData['experience'] = $user->coach->experience;
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $userData,
                'redirect_url' => $this->getRedirectUrl($user->role)
            ])->header('Access-Control-Allow-Origin', '*')
              ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
              ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401)->header('Access-Control-Allow-Origin', '*')
              ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
              ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    }

    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    private function getRedirectUrl($role)
    {
        switch ($role) {
            case 'admin':
                return '/admin/dashboard';
            case 'coach':
                return '/coach/dashboard';
            case 'adherent':
                return '/adherent/dashboard';
            default:
                return '/';
        }
    }

    // Get current user info
    public function me(Request $request)
    {
        // This would typically use authentication middleware
        // For now, we'll implement a simple session-based approach
        return response()->json([
            'success' => true,
            'user' => session('user')
        ]);
    }
}
