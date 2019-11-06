<?php

namespace App\Models;

use App\Models\User;
use App\Models\FarmAddress;
use App\Models\Review;
use App\Models\SwineCart;
use App\Models\TransactionLog;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{

    public $timestamps = false;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'customer_user';

	/**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['address_addressLine1',
        'address_addressLine2',
        'address_province',
        'address_zipCode',
        'landline',
        'mobile'];

	/**
	 * Get all Customer type users
	 */
    public function users()
    {
        return $this->morphMany(User::class, 'userable');
    }

    public function user()
    {
        return $this->morphMany(User::class, 'userable')->limit(1);
    }

    /**
     * Get all of the Customer's farm address/es
     */
    public function farmAddresses()
    {
        return $this->morphMany(FarmAddress::class, 'addressable');
    }

    /**
     * Get Swine Cart items of the customer
     */
    public function swineCartItems()
    {
        return $this->hasMany(SwineCartItem::class);
    }

    /**
     * Get Transaction Logs of the customer
     */
    public function transactionLogs()
    {
        return $this->hasMany(TransactionLog::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
