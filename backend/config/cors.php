<?php

return [

    // Apply CORS to API endpoints and Sanctum CSRF cookie endpoint (for SPA auth)
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    // Explicitly allow local development origins
    'allowed_origins' => [
        'http://127.0.0.1:8000',
        'http://localhost:8000',
        'http://localhost:8080',
        'http://127.0.0.1:8001',
        'http://localhost:8001',
        'http://localhost:8081',
        'http://127.0.0.1:8002',
        'http://localhost:8002',
        'http://localhost:8082',
        'http://127.0.0.1:8003',
        'http://localhost:8003',
        'http://localhost:8083',
        'http://127.0.0.1:8004',
        'http://localhost:8004',
        'http://localhost:8084',
        'http://192.168.2.118:8080',
    ],

    // Regex patterns to allow dynamic ports/hosts as a fallback
    'allowed_origins_patterns' => [
        '^http://localhost(:[0-9]+)?$',
        '^http://127\\.0\\.0\\.1(:[0-9]+)?$',
        '^http://192\\.168\\.[0-9]{1,3}\\.[0-9]{1,3}(:[0-9]+)?$',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true for Sanctum cookie-based auth
    'supports_credentials' => true,

];
