<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>


# Body Motion API

Backend pre Body Treatment C#/.NET WPF aplikáciu a React Native iOS Android aplikáciu Dystonia Treatment

## Dôležité

| Informácia  | Adresa |
| ------------- | ------------- |
| Backend Master URL  | https://sensohealthserver.com/  |
| phpMyAdmin (db - MySQL) | https://auth-db286.hostinger.com/ |

.env:

| Typ  | DB_DATABASE | DB_USER |
| ------------- | ------------- | ------------- |
| Produkcia  | u810938162_bodymo_cloud  | u810938162_admin1f2cloud |
| Develop | u810938162_bodymotiondev | u810938162_developer |

## Štruktúra

Najdôležitejšie priečinky a súbory:

- `app/Http/Controllers` - obsahuje priečinky s Controllermi, každý priečinok reprezentuje nejakú aplikáciu (Body Motion, Aplikácia pre mobil...)
- `app/Http/Controllers/BodyMotion` - Controllers pre Body Motion
- `app/Http/Controllers/DystoniaTreatment` - Controllers pre mobilnú app
- `app/Http/Models` - databázové modely (štruktúra db - je potrebné vždy upravovať db v phpMyAdmin)
- `routes/web.php` - routes - linky, endpointy s odkazom na funkcie, ktoré sa pod danou linkou (adresou) vykonajú - NEPOUŽÍVAŤ PRE FUNKCIE KTORÉ VYŽADUJÚ AUTORIZÁCIU
- `routes/api.php` - tieto endpointy sa budú používať väčšinou stále, hlavne pre endpointy, ktoré musia prejsť API tokenom (autentifikáciou)

## Spustenie & inštalácia

Pull Git a potom:

1. Clone your project
2. Run `composer install` on your cmd or terminal (if you don't have a composer, install it)
3. Copy `.env.example` file to `.env` on the root folder (just rename).
4. Change `.env` file (ja pošlem čo tam treba keďže sú tam citlivé údaje)
5. Run `php artisan key:generate`
6. Run `php artisan migrate`
7. Run `php artisan serve`
8. Go to http://localhost:8000/

Pri vývoji používať len vetvu **develop**. Vetva **master** automaticky vykonáva automatický deploy do Azure
