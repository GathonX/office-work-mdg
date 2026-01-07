<?php

return [

    // Apply CORS to API endpoints and Sanctum CSRF cookie endpoint (for SPA auth)
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    // Use env to define explicit origins (comma-separated), fallback to none
    'allowed_origins' => array_filter(array_map('trim', explode(',', env('FRONTEND_ORIGINS', '')))),

    // Use regex patterns (comma-separated) to allow dynamic ports/hosts, with safe defaults
    'allowed_origins_patterns' => array_filter(array_map('trim', explode(',', env('FRONTEND_ORIGINS_PATTERNS',
        '^http://localhost(:[0-9]+)?$,^http://127\\.0\\.0\\.1(:[0-9]+)?$,^http://192\\.168\\.[0-9]{1,3}\\.[0-9]{1,3}(:[0-9]+)?$'
    )))),

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true for Sanctum cookie-based auth
    'supports_credentials' => true,

];
