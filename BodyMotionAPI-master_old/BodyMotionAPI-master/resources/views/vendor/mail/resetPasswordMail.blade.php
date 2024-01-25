@component('mail::message')
# Hello!
You are receiving this email because we received a password reset request for your account.

Your new password is {{ $data['password'] }}.

Please log in to application and change your password as soon as possible.

If you did not request a password reset, no further action is required.

Regards,<br>
{{ config('app.name') }}
@endcomponent
