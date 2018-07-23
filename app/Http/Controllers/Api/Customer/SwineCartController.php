<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Carbon\Carbon;
use Ramsey\Uuid\Uuid;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\BreederPersonalProfileRequest;
use App\Http\Requests\BreederFarmProfileRequest;
use App\Http\Requests\ProductRequest;

use App\Jobs\AddToTransactionLog;
use App\Jobs\NotifyUser;
use App\Jobs\SendSMS;
use App\Jobs\SendToPubSubServer;
use App\Http\Requests;
use App\Models\Customer;
use App\Models\Breeder;
use App\Models\FarmAddress;
use App\Models\Breed;
use App\Models\Image;
use App\Models\SwineCartItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\TransactionLog;
use App\Models\ProductReservation;

use App\Repositories\ProductRepository;
use App\Repositories\CustomHelpers;

use Auth;
use Response;
use Validator;
use JWTAuth;
use Mail;
use Storage;
use Config;

class SwineCartController extends Controller
{

    use CustomHelpers {
        transformBreedSyntax as private;
        transformDateSyntax as private;
        computeAge as private;
    }

    public function __construct() 
    {
        $this->middleware('jwt:auth');
        $this->middleware('jwt.role:customer');
        $this->middleware(function($request, $next) {
            $this->user = JWTAuth::user();
            return $next($request);
        });
    }


    public function addItem(Request $request, $product_id)
    {
        $customer = $this->user->userable;
        $items = $customer->swineCartItems();
        $cart = $items->get();

        $item = $items->where([
            ['product_id', $product_id],
            ['reservation_id', 0]
        ])->first();
        
        $product = Product::find($product_id);

        if($item) {
            if($item->if_requested) {
                return response()->json([
                    'message' => 'Product already requested!',
                    'cart' => $cart,
                    'data' => $product->name
                ]);
            }
            else {
               return response()->json([
                    'message' => 'Item already Added!',
                    'cart' => $cart,
                    'data' => $product->name
                ]); 
            }
        }
        else {
            $new_item = new SwineCartItem;
            $new_item->product_id = $product_id;
            $new_item->quantity = $product->type == 'semen' ? 2 : 1;
            
            $items->save($new_item);

            return response()->json([
                'message' => 'Add to Cart successful!',
                'cart' => $cart,
                'data' => [
                    'product' => $product,
                    'count' => $customer->swineCartItems()
                        ->where('if_requested', 0)
                        ->count()
                ]
            ]);
        }

        
    }

    public function getItems(Request $request)
    {
        $customer = $this->user->userable;
        $swineCartItems = $customer->swineCartItems()->where('if_requested', 0)->get();
        $items = [];

        foreach ($swineCartItems as $item) {
            $itemDetail = [];
            $product = Product::find($item->product_id);
            $breeder = Breeder::find($product->breeder_id)->users()->first();

            $itemDetail['item_id'] = $item->id;
            $itemDetail['product_id'] = $item->product_id;
            $itemDetail['product_name'] = $product->name;
            $itemDetail['product_type'] = $product->type;
            $itemDetail['product_breed'] = Breed::find($product->breed_id)->name;
            $itemDetail['img_path'] = route('serveImage', ['size' => 'small', 'filename' => Image::find($product->primary_img_id)->name]);
            $itemDetail['breeder'] = $breeder->name;
            $itemDetail['user_id'] = $breeder->id;
            
            array_push($items, $itemDetail);
        }

        
        
        return response()->json([
            'message' => 'Get SwineCart items successful!',
            'data' => $items
        ]);
    }

    public function getItemCount(Request $request)
    {
        $customer = $this->user->userable;
        $count = $customer->swineCartItems()->where('if_requested', 0)->count();

        return response()->json([
            'message' => 'Get SwineCart items successful!',
            'data' => $count
        ]);
    }

    public function deleteItem(Request $request, $item_id)
    {
        $customer = $this->user->userable;
        $item = $customer->swineCartItems()->where('id', $item_id)->first();

        if($item) {
            $product = Product::find($item->product_id);
            $item->delete();

            return response()->json([
                'message' => 'Delete SwineCart item successful!',
                'data' => [
                    'count' => $customer->swineCartItems()->where('if_requested', 0)->count(),
                    'product' => $product
                ]
            ]);
        }
        else return response()->json([
            'error' => 'SwineCart Item does not exist!' 
        ], 404);
    }


    public function requestItem(Request $request, $item_id)
    {
        $customer = $this->user->userable;
        $items = $customer->swineCartItems();

        $item = $items->where('id', $item_id)->first();

        if($item) {
            if(!$item->if_requested) {
                $item->if_requested = 1;
                $item->quantity = $request->requestQuantity;
                $item->date_needed = ($request->dateNeeded) ? date_format(date_create($request->dateNeeded), 'Y-n-j') : '';
                $item->special_request = $request->specialRequest;
                $item->save();

                $product = Product::find($item->product_id);
                $product->status = "requested";
                $product->save();

                $breeder = Breeder::find($product->breeder_id);

                $transactionDetails = [
                    'swineCart_id' => $item->id,
                    'customer_id' => $item->customer_id,
                    'breeder_id' => $product->breeder_id,
                    'product_id' => $product->id,
                    'status' => 'requested',
                    'created_at' => Carbon::now()
                ];

                $notificationDetails = [
                    'description' => '<b>' . $this->user->name . '</b> requested for Product <b>' . $product->name . '</b>.',
                    'time' => $transactionDetails['created_at'],
                    'url' => route('dashboard.productStatus')
                ];

                $smsDetails = [
                    'message' => 'SwineCart ['. $this->transformDateSyntax($transactionDetails['created_at'], 1) .']: ' . $this->user->name . ' requested for Product ' . $product->name . '.',
                    'recipient' => $breeder->office_mobile
                ];

                $pubsubData = [
                    'body' => [
                        'uuid' => (string) Uuid::uuid4(),
                        'id' => $product->id,
                        'reservation_id' => 0,
                        'img_path' => route('serveImage', ['size' => 'small', 'filename' => Image::find($product->primary_img_id)->name]),
                        'breeder_id' => $product->breeder_id,
                        'farm_province' => FarmAddress::find($product->farm_from_id)->province,
                        'name' => $product->name,
                        'type' => $product->type,
                        'age' => $this->computeAge($product->birthdate),
                        'breed' => $this->transformBreedSyntax(Breed::find($product->breed_id)->name),
                        'quantity' => $product->quantity,
                        'adg' => $product->adg,
                        'fcr' => $product->fcr,
                        'bft' => $product->backfat_thickness,
                        'status' => $product->status,
                        'status_time' => '',
                        'customer_id' => 0,
                        'customer_name' => '',
                        'date_needed' => '',
                        'special_request' => '',
                        'delivery_date' => ''
                    ]
                ];

                $breederUser = $breeder->users()->first();

                $this->addToTransactionLog($transactionDetails);

                dispatch(new SendSMS($smsDetails['message'], $smsDetails['recipient']));
                dispatch(new NotifyUser('product-requested', $breederUser->id, $notificationDetails));
                dispatch(new SendToPubSubServer('notification', $breederUser->email));
                dispatch(new SendToPubSubServer('db-productRequest', $breederUser->email, $pubsubData));
                dispatch(new SendToPubSubServer('db-requested', $breederUser->email, ['product_type' => $product->type]));

                return response()->json([
                    'message' => 'Request SwineCart Item successful',
                    'data' => [
                        'count' => $customer->swineCartItems()->where('if_requested',0)->count(),
                        'transactionDetails' => $transactionDetails
                    ]
                ]);
            }
            else return response()->json([
                'error' => 'SwineCart Item already requested!' 
            ], 404);
        }
        else return response()->json([
            'error' => 'SwineCart Item does not exist!' 
        ], 404);
        
    }
}