<?php

namespace App\Policies;

use App\Models\Record;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class RecordPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function show(User $user, Record $record) {
        return $user->id === $record->patient->doctor_id || $user->is_admin
            ? Response::allow()
            : Response::deny('User does not have a permission to get record info.');
    }

    public function delete(User $user, Record $record) {
        return $user->id === $record->patient->doctor_id || $user->is_admin
            ? Response::allow()
            : Response::deny('User does not have a permission to delete record.');
    }
}
