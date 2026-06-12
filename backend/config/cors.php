<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // هنا فين كاين المشكل! بدل هاد السطر ودير فيه رابط الـ Vercel ديالك
    'allowed_origins' => [
        'https://mazoir-game-store.vercel.app', // رابط الـ Frontend الجديد
        'http://localhost:5173',               // خلّيه احتياطاً إلا بغيتي تخدم فـ الـ local
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // ردها true حيت غتحتاجها فـ الـ Login والـ Cookies

];