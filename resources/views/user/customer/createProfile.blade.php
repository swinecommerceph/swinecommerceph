@extends('user.customer.home')

@section('title')
    | Customer - Complete Profile
@endsection

@section('content')
    <div class="row">
        <div class="col s12 m6 offset-m3">
            <h4>Complete Profile </h4>
            <h6>Please complete first your profile.</h6>
            <span>* - required </span>
            @include('common._errors')
            {!! Form::open(['route' => 'customer.store']) !!}
                @include('user.customer._profileForm')
            {!! Form::close() !!}
        </div>
    </div>

@endsection
