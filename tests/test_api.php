<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/api/auth/login', 'POST', [
    'email' => 'budi.s@smartcafe.id',
    'password' => 'password',
]);

$response = $kernel->handle($request);
echo "Login Status: " . $response->getStatusCode() . "\n";
$data = json_decode($response->getContent(), true);

if (isset($data['token'])) {
    $token = $data['token'];
    
    $endpoints = [
        '/api/dashboard' => 'GET',
        '/api/menus' => 'GET',
        '/api/inventories' => 'GET',
        '/api/reports' => 'GET',
    ];

    foreach ($endpoints as $uri => $method) {
        $req = Illuminate\Http\Request::create($uri, $method);
        $req->headers->set('Authorization', 'Bearer ' . $token);
        $req->headers->set('Accept', 'application/json');
        
        $res = $kernel->handle($req);
        echo "$method $uri Status: " . $res->getStatusCode() . "\n";
        if ($res->getStatusCode() !== 200) {
            echo "Body: " . substr($res->getContent(), 0, 1000) . "\n\n";
        }
    }
}

