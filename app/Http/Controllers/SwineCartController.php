<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

use App\Http\Requests;
use App\Models\Customer;
use App\Models\Breeder;
use App\Models\Breed;
use App\Models\Image;
use App\Models\SwineCartItem;
use App\Models\Product;
use Auth;

class SwineCartController extends Controller
{
    protected $user;

    /**
     * Create new CustomerController instance
     */
    public function __construct()
    {
        $this->middleware('role:customer');
        $this->middleware('updateProfile:customer');
        $this->user = Auth::user();
    }

    /**
     * Add to Swine Cart the product picked by the user
     * AJAX
     *
     * @return Array
     */
    public function addToSwineCart(Request $request)
    {
        if($request->ajax()){
            $customer = $this->user->userable;
            $swineCartItems = $customer->swineCartItems();
            $checkProduct = $swineCartItems->where('product_id',$request->productId)->get();

            // Check first if product is already in Swine Cart
            if(!$checkProduct->isEmpty()){
                // Then check if it is already requested
                if($checkProduct->first()->ifRequested) $returnArray = ['requested', Product::find($request->productId)->name];
                else $returnArray = ['fail', Product::find($request->productId)->name];
                return $returnArray;
            }
            else{
                $item = new SwineCartItem;
                $item->product_id = $request->productId;
                $item->quantity = 1;

                $swineCartItems->save($item);

                $returnArray = ['success', Product::find($request->productId)->name, $customer->swineCartItems()->where('if_requested',0)->count()];
                return $returnArray;
            }
        }
    }

    /**
     * Delete item from Swine Cart
     * AJAX
     *
     * @return Array
     */
    public function deleteFromSwineCart(Request $request)
    {
        if($request->ajax()){
            $customer = $this->user->userable;
            $item = $customer->swineCartItems()->where('id',$request->itemId)->get()->first();
            $product_name = Product::find($item->product_id)->name;
            if($item) {
                $item->delete();
                return ["success", $product_name, $customer->swineCartItems()->where('if_requested',0)->count()];
            }
            else return ["not found", $product_id];

        }
    }

    /**
     * Get items in the Swine Cart
     * AJAX
     *
     * @return JSON
     */
    public function getSwineCartItems(Request $request)
    {
        if($request->ajax()){
            $customer = $this->user->userable;
            $swineCartItems = $customer->swineCartItems()->where('if_requested',0)->get();
            $items = [];

            foreach ($swineCartItems as $item) {
                $itemDetail = [];
                $product = Product::find($item->product_id);
                $itemDetail['item_id'] = $item->id;
                $itemDetail['product_id'] = $item->product_id;
                $itemDetail['product_name'] = $product->name;
                $itemDetail['product_type'] = $product->type;
                $itemDetail['product_breed'] = Breed::find($product->breed_id)->name;
                $itemDetail['img_path'] = '/images/product/'.Image::find($product->primary_img_id)->name;
                $itemDetail['breeder'] = Breeder::find($product->breeder_id)->users()->first()->name;
                $itemDetail['token'] = csrf_token();
                array_push($items,$itemDetail);
            }

            $itemsCollection = collect($items);
            return $itemsCollection->toJson();
        }
    }

    /**
     * Get number of items in the Swine Cart
     * AJAX
     *
     * @return int
     */
    public function getSwineCartQuantity(Request $request)
    {
        if($request->ajax()){
            $customer = $this->user->userable;
            return $customer->swineCartItems()->where('if_requested',0)->count();
        }
    }
}
