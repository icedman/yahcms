<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Firebase\Auth\Token\Verifier;
use Firebase\Auth\Token\HttpKeyStore;
use Symfony\Component\Cache\Simple\FilesystemCache;
use App\Mongo\MongoDB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
        $this->app->singleton(Verifier::class, function ($app) {
            $projectId = config('services.firebase.project_id');
            $cache = new FilesystemCache();
            $keyStore = new HttpKeyStore(null, $cache);
            return new Verifier($projectId, $keyStore); 
            // return new Verifier($projectId);
        });

        //
        $this->app->singleton(MongoDB::class, function ($app) {
            $host = config('services.mongo.host');
            $port = config('services.mongo.port');
            $user = config('services.mongo.user');
            $pass = config('services.mongo.pass');
            $database = config('services.mongo.database');
            return new MongoDB("mongodb://{$user}:{$pass}@{$host}:{$port}", $database); 
        });
    }
}
