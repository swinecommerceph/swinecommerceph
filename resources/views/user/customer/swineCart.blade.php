{{--
    Displays Home page of Customer User
--}}

@extends('layouts.default')

@section('title')
    | Customer
@endsection

@section('pageId')
    id="page-customer-swine-cart"
@endsection

@section('breadcrumbTitle')
    Swine Cart
@endsection

@section('breadcrumb')
    <a href="{{ route('home_path') }}" class="breadcrumb">Home</a>
    <a href="#!" class="breadcrumb">Swine Cart</a>
@endsection

@section('navbarHead')
    <li><a href="{{ route('products.view') }}"> Products </a></li>
    <li><a href="{{ route('home_path') }}"> <i class="material-icons">message</i></a></li>
    @if(!Auth::user()->update_profile)
        <li><a id="cart-icon" class="dropdown-button" data-beloworigin="true" data-activates="cart-dropdown">
                <i class="material-icons">shopping_cart</i>
                <span></span>
            </a>
            <ul id="cart-dropdown" class="dropdown-content collection">
                <div id="preloader-circular" class="row">
                    <div class="center-align">
                        <div class="preloader-wrapper small active">
                            <div class="spinner-layer spinner-blue-only">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>

                            {{-- <div class="spinner-layer spinner-red">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div><div class="gap-patch">
                                    <div class="circle"></div>
                                </div><div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>

                            <div class="spinner-layer spinner-yellow">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div><div class="gap-patch">
                                    <div class="circle"></div>
                                </div><div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>

                            <div class="spinner-layer spinner-green">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div><div class="gap-patch">
                                    <div class="circle"></div>
                                </div><div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div> --}}
                        </div>
                    </div>
                </div>
                <li>
                    <ul id="item-container" class="collection">
                    </ul>
                </li>

                <li>
                    <a href="{{ route('view.cart') }}" class="left">Go to Cart</a>
                    <a href="{{ route('home_path') }}" class="right">Request items</a>
                </li>
            </ul>
        </li>
    @endif
@endsection

@section('navbarDropdown')
    <li><a href="{{ route('customer.edit') }}"> <i class="material-icons left">people</i> Update Profile</a></li>
    <li class="divider"></li>
    <li><a href="{{ route('home_path') }}"> <i class="material-icons left">shopping_cart</i> Swine Cart </a> </li>
@endsection

@section('static')
    <div class="fixed-action-btn" style="bottom: 30px; right: 24px;">
      <a id="back-to-top" class="btn-floating btn-large red tooltipped" style="display:none;" data-position="left" data-delay="50" data-tooltip="Back To Top">
        <i class="material-icons">keyboard_arrow_up</i>
      </a>
    </div>
@endsection

@section('content')
    {{-- Rating Modal --}}

    <div id="rate" class="modal">
      <div class="modal-content">
        <h4>Rating</h4>
        <div class="divider"></div>
        <div class="center-align">
          <br>
          <span class="row">
              <i class="col s6">Delivery</i>
              <span class="col s6">
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star_half</i>
                  <i class="material-icons yellow-text">star_border</i>
              </span>
          </span>
          <span class="row">
              <i class="col s6">Transaction</i>
              <span class="col s6">
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star_border</i>
              </span>
          </span>
          <span class="row">
              <i class="col s6">Product Quality</i>
              <span class="col s6">
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star_half</i>
              </span>
          </span>
          <span class="row">
              <i class="col s6">After Sales</i>
              <span class="col s6">
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star</i>
                  <i class="material-icons yellow-text">star_half</i>
                  <i class="material-icons yellow-text">star_border</i>
                  <i class="material-icons yellow-text">star_border</i>
              </span>
          </span>
        </div>
        <form class="rating" action="index.html" method="post">

        </form>
      </div>
      <div class="modal-footer">
        <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Submit</a>
      </div>
    </div>

    {{-- Swine Cart --}}
      <ul class="collection">
      {{-- @if($products->length === 0)
        <h4>No product in your cart</h4>
      @else --}}
      <li class="collection-item">
        <div class="row">
          <div class="col s2 right-align">
            Status
          </div>
          <div class="col s2 center-align">
            Images
          </div>
          <div class="col s4">
            Info
          </div>
          <div class="col s2 right-align">
            Quantity
          </div>
          <div class="col s2">
            Action
          </div>
        </div>
      </li>
        @forelse($products as $product)
            {{-- Original Content --}}
            <li class="collection-item">
              <div class="row">
                @if($product->request_status === '1')
                  <div class="status col s2 right-align">
                      Requested
                  </div>
                  <div class="info col s2 center-align">
                    <a href="#"><img src="{{$product->img_path}}" width="75" height="75" class="circle"></a>
                  </div>
                @elseif($product->request_status === '0' and $product->status != 'showcased')
                  <div class="status col s2 right-align">
                      {{ucfirst($product->status)}}
                      @if(($product->status === 'sold'))
                        <a href="#rate" class="modal-trigger"><i class="material-icons teal-text">rate_review</i></a>
                      @endif
                  </div>
                  <div class="info col s2 center-align">
                    <a href="#"><img src="{{$product->img_path}}" width="75" height="75" class="circle"></a>
                  </div>
                @else
                  <div class="info col s2 offset-s2 center-align">
                    <a href="#"><img src="{{$product->img_path}}" width="75" height="75" class="circle"></a>
                  </div>
                @endif
                <div class="col s4">
                  <a href="#" class="anchor-title teal-text"><span class="col s12">{{$product->product_name}}</span></a>
                  <span class="col s12">
                    {{ucfirst($product->product_type)}} -
                    {{-- @if(strrchr($product->product_breed, '+') !== FALSE)
                      {{$breed = explode('+','$product->product_breed')}}
                    @else --}}
                      {{ucfirst($product->product_breed)}}
                    {{-- @endif --}}
                  </span>
                  <span class="col s12">
                    {{$product->breeder}}
                  </span>
                </div>
                @if($product->product_type === 'semen')
                  <div class="col s2">
                      <div class="container">
                        <input type="text" name="semen-quantity">
                      </div>
                  </div>
                  <div class="col s2">
                    <form method="POST" action="{{route('cart.delete')}}" accept-charset="UTF-8" data-item-id="{{$product->item_id}}">
                      <input name="_method" type="hidden" value="DELETE">
                      <input name="_token" type="hidden" value="{{$product->token}}">
                      <a href="#" class="delete-from-swinecart tooltipped" data-position="bottom" data-delay="50" data-tooltip="Delete product"><i class="material-icons teal-text">clear</i></a>
                    </form>
                    @if($product->status === 'showcased')
                      <form method="PUT" class="request-icon" action="{{route('cart.request')}}" accept-charset="UTF-8" data-item-id="{{$product->item_id}}" data-product-id="{{$product->product_id}}">
                        <input name="_token" type="hidden" value="{{$product->token}}">
                        <a href="#" class="request-product tooltipped" data-position="bottom" data-delay="50" data-tooltip="Request product"><i class="material-icons teal-text">play_for_work</i></a>
                      </form>
                    @endif
                  </div>
                @else
                  <div class="col s2 offset-s2">
                    <form method="POST" action="{{route('cart.delete')}}" accept-charset="UTF-8" data-item-id="{{$product->item_id}}">
                      <input name="_method" type="hidden" value="DELETE">
                      <input name="_token" type="hidden" value="{{$product->token}}">
                      <a href="#" class="delete-from-swinecart tooltipped" data-position="bottom" data-delay="50" data-tooltip="Delete product"><i class="material-icons teal-text">clear</i></a>
                    </form>
                    @if($product->status === 'showcased')
                      <form method="PUT" class="request-icon" action="{{route('cart.request')}}" accept-charset="UTF-8" data-item-id="{{$product->item_id}}" data-product-id="{{$product->product_id}}">
                        <input name="_token" type="hidden" value="{{$product->token}}">
                        <a href="#" class="request-product tooltipped" data-position="bottom" data-delay="50" data-tooltip="Request product"><i class="material-icons teal-text">play_for_work</i></a>
                      </form>
                    @endif
                  </div>
                @endif

              </div>
        @empty
          <div class="row">
            <div class="col s12 center-align">
              <h5>Your swine cart is empty.</h5>
            </div>
          </div>
        @endforelse
      {{-- @endif --}}
      </ul>


@endsection

@section('initScript')
    <script src="/js/customer/swinecart.js"> </script>
    <script src="/js/customer/customer_custom.js"> </script>
    <script src="/js/customer/swinecart_script.js"> </script>
@endsection
