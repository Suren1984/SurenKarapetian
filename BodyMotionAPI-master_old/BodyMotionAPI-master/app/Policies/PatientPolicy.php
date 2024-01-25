<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class PatientPolicy
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

    public function show(User $user, Patient $patient) {
        return $user->id === $patient->doctor_id || $user->is_admin
            ? Response::allow()
            : Response::deny('User does not have a permission to get patient info.');
    }

    public function delete(User $user, Patient $patient) {
        return $user->id === $patient->doctor_id || $user->is_admin
            ? Response::allow()
            : Response::deny("User does not have a permission to delete patient or patient's records.");
    }

    public function createRecord(User $user, Patient $patient) {
        return $user->id === $patient->doctor_id
            ? Response::allow()
            : Response::deny('User does not have a permission to create a record for patient.');
    }

    public function update(User $user, Patient $patient) {
        return $user->id === $patient->doctor_id
            ? Response::allow()
            : Response::deny('User does not have a permission to update patient.');
    }

    public function register(User $user, Patient $patient) {
        return $user->id === $patient->doctor_id
            ? Response::allow()
            : Response::deny('User does not have a permission to register patient.');
    }
}
