@component('mail::message')
# Hello!
Your account has been successfully created.

You can now log in to application with credentials:<br>
**Username:** {{ $data['username'] }}<br>
**Password:** {{ $data['password'] }}

Please log in to application and change your password as soon as possible.

Regards,<br>
{{ config('app.name') }}
@endcomponent
