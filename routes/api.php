<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Setup CORS */
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Accept-Encoding, Content-Type, Accept, Access-Control-Request-Method, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE");

Route::group(['middleware' => 'api', 'namespace' => 'Api'], function() {
    Route::group(['namespace' => 'Auth', 'prefix' => 'auth'], function() {
        Route::post('/register', 'RegisterController@register');
        Route::post('/login', 'LoginController@normalLogin');
        Route::get('/me', 'LoginController@me');
        Route::post('/logout', 'LogoutController@logout');
    });    

    Route::group(['namespace' => 'Breeder', 'prefix' => 'breeder'], function() {
        Route::group(['prefix' => 'profile'], function() {
            Route::get('/', 'EditProfileController@getProfile');
            Route::put('/', 'EditProfileController@updatePersonal');
            Route::patch('/password', 'EditProfileController@changePassword');

            Route::get('/farms', 'EditProfileController@getFarms');
            Route::get('/farms/{id}', 'EditProfileController@getFarm');
            Route::put('/farms/{id}', 'EditProfileController@updateFarm');
            Route::delete('/farms/{id}', 'EditProfileController@deleteFarm');
            
            // Route::post('/upload-logo', 'EditProfileController@uploadLogo');
            // Route::delete('/delete-logo', 'EditProfileController@deleteLogo');
            // Route::post('/set-logo', 'EditProfileController@setLogo');
        });

        Route::group(['prefix' => 'products'], function() {
            Route::get('/', 'ProductController@getProducts');
            Route::delete('/', 'ProductController@deleteProducts');
            Route::patch('/', 'ProductController@updateSelected');

            Route::get('/{id}', 'ProductController@getProduct');
            Route::get('/{id}/details', 'ProductController@getProductDetails');
            Route::get('/{id}/media', 'ProductController@getProductMedia');

            Route::post('/', 'ProductController@addProduct');
            Route::put('/{id}', 'ProductController@updateProduct');
            Route::patch('/{id}/status', 'ProductController@toggleProductStatus');

            // Route::post('/set-primary-picture', 'ProductController@setPrimaryPicture');
            // Route::delete('/media/delete', 'ProductController@deleteMedium');

        });

        Route::group(['prefix' => 'dashboard'], function() {
            Route::get('/stats', 'DashboardController@getDashBoardStats');
            Route::get('/server-date', 'DashboardController@getServerDate');
            Route::get('/ratings', 'DashboardController@getRatings');
            Route::get('/reviews', 'DashboardController@getReviews');
        });

        Route::group(['prefix' => 'inventory'], function() {
            Route::get('/products/{status}', 'InventoryController@getProducts');
            Route::get('/products/{id}/requests', 'InventoryController@getProductRequests');
            Route::post('/products/{id}/order-status', 'InventoryController@updateOrderStatus');
            Route::delete('/products/{id}/order-status', 'InventoryController@cancelTransaction');

            Route::get('/customers/{id}', 'InventoryController@getCustomer');
        });

        Route::group(['prefix' => 'notifications'], function() {
            Route::get('/', 'NotificationsController@getNotifications');
            Route::patch('/{id}', 'NotificationsController@SeeNotification');
        });

        Route::group(['prefix' => 'chats'], function() {
            Route::get('/', 'MessageController@getThreads');
            Route::get('/{id}', 'MessageController@getMessages');
            Route::patch('/{id}/{messageId}', 'MessageController@seeMessage');
        });
    });
 
    Route::group(['namespace' => 'Customer', 'prefix' => 'customer'], function() {
        Route::group(['prefix' => 'profile'], function() {
            Route::get('/', 'EditProfileController@getProfile');
            Route::put('/', 'EditProfileController@updatePersonal');
            Route::patch('/password', 'EditProfileController@changePassword');

            Route::get('/farms', 'EditProfileController@getFarms');
            Route::get('/farms/{id}', 'EditProfileController@getFarm');
            Route::post('/farms', 'EditProfileController@addFarm');
            Route::put('/farms/{id}', 'EditProfileController@updateFarm');
            Route::delete('/farms/{id}', 'EditProfileController@deleteFarm');
        });

        Route::group(['prefix' => 'products'], function() {
            Route::get('/', 'ProductController@getProducts');
            Route::get('/breeders', 'ProductController@getBreeders');
            Route::get('/breeds', 'ProductController@getBreeds');
        });

        Route::group(['prefix' => 'swinecart'], function() {
            Route::get('/items', 'SwineCartController@getItems');

            Route::post('/items/{id}', 'SwineCartController@addItem');
            Route::delete('/items/{id}', 'SwineCartController@deleteItem');
            Route::put('/items/{id}', 'SwineCartController@requestItem');

            Route::get('/transactions', 'SwineCartController@getTransactionHistory');
            Route::post('/rate-breeder/{id}', 'SwineCartController@rateBreeder');
        });

        Route::group(['prefix' => 'notifications'], function() {
            Route::get('/get', 'NotificationsController@getNotifications');
            Route::get('/count', 'NotificationsController@getNotificationsCount');
            Route::post('/see/{id}', 'NotificationsController@SeeNotification');
        });

        Route::group(['prefix' => 'messages'], function() {
            Route::get('/threads', 'MessageController@getThreads');
            Route::get('/unread/count', 'MessageController@unreadCount');
            Route::get('/{id}', 'MessageController@getMessages');
        });
    });
    
});
