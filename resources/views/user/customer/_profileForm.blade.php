<!--
	All String
	Address Line 1
	Address Line 2
	Province
	Zip Code
	Landline
	Mobile
	Farm Address Line 1
	Farm Address Line 2
	Farm Address Province
	Farm Address Zip Code
	Farm type
	Farm landline
	Farm mobile
-->

<ul class="collapsible" data-collapsible="accordion">
	<li>
	  <div class="collapsible-header active"><i class="material-icons">person_outline</i>Personal Information</div>
	  <div class="collapsible-body">

		  <div class="row">
			<!-- Address: Street Address -->
		  	<div class="input-field col s10 push-s1">
		  		{!! Form::text('address_addressLine1', null, ['autofocus' => 'autofocus'])!!}
		  		{!! Form::label('address_addressLine1', 'Address Line 1* : Street, Road, Subdivision') !!}
		  	</div>
		  </div>


		  <div class="row">
			<!-- Address: Address Line 2 -->
		  	<div class="input-field col s10 push-s1">
		  		{!! Form::text('address_addressLine2', null)!!}
		  		{!! Form::label('address_addressLine2', 'Address Line 2* : Barangay, Town, City') !!}
		  	</div>
		  </div>


		  <div class="row">
			<!-- Address: Province -->
		  	<div class="input-field col s5 push-s1">
		  		{!! Form::text('address_province', null)!!}
		  		{!! Form::label('address_province', 'Province*') !!}
		  	</div>

			<!-- Address: Zip Code -->
			<div class="input-field col s5 push-s1">
		  		{!! Form::text('address_zipCode', null)!!}
		  		{!! Form::label('address_zipCode', 'Postal/ZIP Code*') !!}
		  	</div>
		  </div>

		  <div class="row">
			<!-- Landline -->
		  	<div class="input-field col s5 push-s1">
		  		{!! Form::text('landline', null)!!}
		  		{!! Form::label('landline', 'Landline') !!}
		  	</div>

			<!-- Mobile -->
			<div class="input-field col s5 push-s1">
		  		{!! Form::text('mobile', null)!!}
		  		{!! Form::label('mobile', 'Mobile*') !!}
		  	</div>
		  </div>
	  </div>
	</li>
	<li>
	  <div class="collapsible-header"><i class="material-icons">store</i>Farm Information (Optional)</div>
	  <div class="collapsible-body">
		  <div class="row">
			<!-- Farm Address: Street Address -->
		  	<div class="input-field col s10 push-s1">
		  		{!! Form::text('farmAddress_addressLine1', null)!!}
		  		{!! Form::label('farmAaddress_addressLine1', 'Address Line 1 : Street, Road, Subdivision') !!}
		  	</div>
		  </div>


		  <div class="row">
			<!-- Farm Address: Address Line 2 -->
		  	<div class="input-field col s10 push-s1">
		  		{!! Form::text('farmAddress_addressLine2', null)!!}
		  		{!! Form::label('farmAddress_addressLine2', 'Address Line 2 : Barangay, Town, City') !!}
		  	</div>
		  </div>


		  <div class="row">
			<!-- Farm Address: Province -->
		  	<div class="input-field col s5 push-s1">
		  		{!! Form::text('farmAddress_province', null)!!}
		  		{!! Form::label('farmAddress_province', 'Province') !!}
		  	</div>

			<!-- Farm Address: Zip Code -->
			<div class="input-field col s5 push-s1">
		  		{!! Form::text('farmAddress_zipCode', null)!!}
		  		{!! Form::label('farmAddress_zipCode', 'Postal/ZIP Code') !!}
		  	</div>
		  </div>

		  <!-- Farm Type -->
		  <div class="row">
		  	<div class="input-field col s5 push-s1">
		  		{!! Form::text('farm_type', null)!!}
		  		{!! Form::label('farm_type', 'Farm Type') !!}
		  	</div>
		  </div>


		  <div class="row">
			<!-- Farm Landline -->
		  	<div class="input-field col s5 push-s1">
		  		{!! Form::text('farm_landline', null)!!}
		  		{!! Form::label('farm_landline', 'Farm Landline') !!}
		  	</div>

			<!-- Farm Mobile -->
			<div class="input-field col s5 push-s1">
		  		{!! Form::text('farm_mobile', null)!!}
		  		{!! Form::label('farm_mobile', 'Farm Mobile') !!}
		  	</div>
		  </div>

	  </div>
	</li>
</ul>

<!-- Submit Button -->
<div class="col s6 push-s6">
  <button type="submit" class="btn waves-effect waves-light"> Submit
	  <i class="material-icons right">send</i>
  </button>
</div>
