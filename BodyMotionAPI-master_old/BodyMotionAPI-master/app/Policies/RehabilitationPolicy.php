<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\Rehabilitation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class RehabilitationPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    public function delete(User $user, Rehabilitation $rehabilitation) {
        return $user->id === $rehabilitation->patient->doctor_id || $user->is_admin
            ? Response::allow()
            : Response::deny('User does not have a permission to delete rehabilitation.');
    }
}
