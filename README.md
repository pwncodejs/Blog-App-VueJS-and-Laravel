<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## The Blog App with laravel and vue3


## Project setup

After you clone this project, do the following:

```bash
# go into the project
cd Blog-App-VueJS-and-Laravel

# create a .env file
cp .env.example .env

# install composer dependencies
composer install

# install npm dependencies
npm install

# generate a key for your application
php artisan key:generate

# add the database connection config to your .env file

#add domains in the SANCTUM_STATEFUL_DOMAINS in .env file if project is running on different port

#Set the backend url in .env for accessing image example VITE_FILE_URL = "http://localhost:8000/"

# run the migration files to generate the schema
php artisan migrate

#Run the server
php artisan serve

npm run dev

```


Good Luck :)