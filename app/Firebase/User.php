<?php

namespace App\Firebase;

use Illuminate\Contracts\Auth\Authenticatable;
// use App\User as Users;
// use App\Agents;
    
class User implements Authenticatable
{
    /**
     * The claims decoded from the JWT token.
     *
     * @var array
     */
    private $claims;

    /**
     * Creates a new authenticatable user from Firebase.
     */
    public function __construct($claims)
    {
        // is agent
        // $query = Agents::where('email', '=', $claims['email']);
        // if ($query->count() > 0) {
        //     $claims['agent'] = $query->get()[0];
        // }

        // // is admin
        // $query = Users::where('email', '=', $claims['email']);
        // if ($query->count() > 0) {
        //     $claims['admin'] = $query->get()[0];
        //     $claims['agent']= array('id'=>'0','name' => $claims['admin']->name);
        // }

        $this->claims = $claims;
    }

    public function getAuthClaims()
    {
        return $this->claims;
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'sub';
    }

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return (string) $this->claims['sub'];
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        throw new \Exception('No password for Firebase User');
    }

    /**
     * Get the token value for the "remember me" session.
     *
     * @return string
     */
    public function getRememberToken()
    {
        throw new \Exception('No remember token for Firebase User');
    }

    /**
     * Set the token value for the "remember me" session.
     *
     * @param string $value
     *
     * @return void
     */
    public function setRememberToken($value)
    {
        throw new \Exception('No remember token for Firebase User');
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        throw new \Exception('No remember token for Firebase User');
    }
}