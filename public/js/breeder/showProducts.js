'use strict';

var product = {

    before_select_value : '' ,
    current_display_photo : 0,
    modal_history : [],
    other_details_default :
        '<div class="detail-container">'+
            '<div class="input-field col s6">'+
                '<input class="validate" name="characteristic[]" type="text">'+
                '<label for="characteristic[]">Characteristic</label>'+
            '</div>'+
            '<div class="input-field col s5">'+
                '<input class="validate" name="value[]" type="text">'+
                '<label for="value[]">Value</label>'+
            '</div>'+
            '<div class="input-field col s1 remove-button-container">'+
'                <a href="#" class="tooltipped remove-detail" data-position="top" data-delay="50" data-tooltip="Remove detail">'+
                    '<i class="material-icons grey-text text-lighten-1">remove_circle</i>'+
                '</a>'+
            '</div>'+
        '</div>'
    ,

    modal_history_tos : function(){
        return product.modal_history[product.modal_history.length-1];
    },

    add : function(parent_form){
        // Attach overlay preloader
        $('<div id="overlay-preloader-circular" class="valign-wrapper" style="padding:7rem;">'+
            '<div class="center-align preloader-overlay">'+
                '<div class="preloader-wrapper big active">'+
                    '<div class="spinner-layer spinner-blue-only">'+
                        '<div class="circle-clipper left">'+
                          '<div class="circle"></div>'+
                        '</div><div class="gap-patch">'+
                          '<div class="circle"></div>'+
                        '</div><div class="circle-clipper right">'+
                          '<div class="circle"></div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>')
        .css({
            position: "absolute", width: "100%", height: "100%", top: $('#add-product-modal .modal-content').scrollTop(), left: 0, background: "rgba(255,255,255,0.8)", display:"block"
        })
        .appendTo($("#add-product-modal .modal-content").css("position", "relative"));

        // Let the overlay preloader change its top position every scroll
        $('#add-product-modal .modal-content').scroll(function(){
            $('#overlay-preloader-circular').css({top:$(this).scrollTop()});
        });

        var data_values = {
            "name": parent_form.find('input[name=name]').val(),
            "type": parent_form.find('#select-type').val(),
            "farm_from_id": parent_form.find('#select-farm').val(),
            "birthdate": parent_form.find('input[name=birthdate]').val(),
            "price": parent_form.find('input[name=price]').val(),
            "adg": parent_form.find('input[name=adg]').val(),
            "fcr": parent_form.find('input[name=fcr]').val(),
            "backfat_thickness": parent_form.find('input[name=backfat_thickness]').val(),
            "_token" : parent_form.find('input[name=_token]').val(),
        };

        // Transform breed syntax if crossbreed
        if($("#create-product input:checked").val() === 'crossbreed'){
            var fbreed = parent_form.find('input[name=fbreed]').val();
            var mbreed = parent_form.find('input[name=mbreed]').val();

            data_values["breed"] = fbreed.toLowerCase().trim()+'+'+mbreed.toLowerCase().trim();
        }
        else data_values["breed"] = parent_form.find('input[name=breed]').val().toLowerCase().trim();

        // Transform syntax of Other details category values
        var other_details = '';
        $(parent_form).find('.detail-container').map(function () {
            var characteristic = $(this).find('input[name="characteristic[]"]').val();
            var value = $(this).find('input[name="value[]"]').val();
            if(characteristic && value) other_details += characteristic+' = '+value+',';
        });

        data_values["other_details"] = other_details;

        // Do AJAX
        $.ajax({
            url: parent_form.attr('action'),
            type: "POST",
            cache: false,
            data: data_values,
            success: function(data){
                var data = JSON.parse(data);
                var hidden_inputs =
                    '<input name="productId" type="hidden" value="'+data.product_id+'">'+
                    '<input name="name" type="hidden" value="'+data.name+'">'+
                    '<input name="type" type="hidden" value="'+data.type+'">'+
                    '<input name="breed" type="hidden" value="'+data.breed+'">';

                Materialize.toast('Product added!', 2500, 'green lighten-1');

                $('#media-dropzone').append(hidden_inputs);
                $('#add-media-modal h4').append(' to '+data.name);
                $('.add-product-button').attr('href','#add-media-modal');
                $('#overlay-preloader-circular').remove();
                $('#add-product-modal').modal('close');
                parent_form.find('#submit-button').removeClass('disabled');

                $('#submit-button').removeClass('disabled');
                $('#submit-button').html('Add');

                // Open Add Media Modal
                $('#add-media-modal').modal({
                    dismissible: false,
                    ready: function(){
                        // Resize media-dropzone's height
                        var content_height = $('#add-media-modal .modal-content').height();
                        var header_height = $('#add-media-modal h4').height();
                        $('#media-dropzone').css({'height': content_height - header_height});

                        $( window ).resize(function() {
                            var content_height = $('#add-media-modal .modal-content').height();
                            var header_height = $('#add-media-modal h4').height();
                            $('#media-dropzone').css({'height': content_height - header_height});
                        });
                    }
                });
                $('#add-media-modal').modal('open');
                product.modal_history.push('#add-media-modal');
            },
            error: function(message){
                console.log(message['responseText']);
                $('#overlay-preloader-circular').remove();
            }
        });
    },

    edit: function(parent_form, update_button){
        var data_values = {
            "id": parent_form.find('input[name=productId]').val(),
            "name": parent_form.find("input[name='edit-name']").val(),
            "type": parent_form.find('#edit-select-type').val(),
            "farm_from_id": parent_form.find('#edit-select-farm').val(),
            "birthdate": parent_form.find("input[name='edit-birthdate']").val(),
            "price": parent_form.find("input[name='edit-price']").val(),
            "adg": parent_form.find("input[name='edit-adg']").val(),
            "fcr": parent_form.find("input[name='edit-fcr']").val(),
            "backfat_thickness": parent_form.find("input[name='edit-backfat_thickness']").val(),
            "_token" : parent_form.find('input[name=_token]').val(),
        };

        // Transform breed syntax if crossbreed
        if($("#edit-product input:checked").val() === 'crossbreed'){
            var fbreed = parent_form.find("input[name='edit-fbreed']").val();
            var mbreed = parent_form.find("input[name='edit-mbreed']").val();

            data_values["breed"] = fbreed.toLowerCase().trim()+'+'+mbreed.toLowerCase().trim();
        }
        else data_values["breed"] = parent_form.find("input[name='edit-breed']").val().toLowerCase().trim();

        // Transform syntax of Other details category values
        var other_details = '';
        $(parent_form).find('.detail-container').map(function () {
            var characteristic = $(this).find('input[name="characteristic[]"]').val();
            var value = $(this).find('input[name="value[]"]').val();
            if(characteristic && value) other_details += characteristic+' = '+value+',';
        });

        data_values["other_details"] = other_details;

        $.when(
            // Wait for the update on the database
            // Do AJAX
            $.ajax({
                url: parent_form.attr('action'),
                type: "PUT",
                cache: false,
                data: data_values,
                success: function(data){
                    Materialize.toast('Product updated!', 1500, 'green lighten-1');
                    $('#edit-product-modal').modal('close');
                },
                error: function(message){
                    console.log(message['responseText']);
                }
            })
        ).done(function(){
            // Enable update-button
            update_button.removeClass('disabled');
            update_button.html('Update Product');

            // Then get the product summary
            product.get_summary($('#edit-product').find('input[name="productId"]').val());
        });
    },

    delete_selected: function(parent_form, products){
        // Check if there are checked products
        if(products.length > 0){
            // Acknowledge first confirmation to remove
            $('#confirmation-modal').modal('open');
            $('#confirm-remove').click(function(e){
                e.preventDefault();

                config.preloader_progress.fadeIn();
                // Do AJAX
                $.ajax({
                    url: config.manageSelected_url,
                    type: "DELETE",
                    cache: false,
                    data: {
                        "_token": parent_form.find('input[name=_token]').val(),
                        "product_ids": products
                    },
                    success: function(data){
                        products.forEach(function(element){
                            $('#product-'+element).remove();
                        });
                        config.preloader_progress.fadeOut();
                        Materialize.toast('Selected Products deleted!', 2000, 'green lighten-1');

                    },
                    error: function(message){
                        console.log(message['responseText']);
                    }
                });
            });
        }
        else Materialize.toast('No products chosen!', 1500 , 'orange accent-2');
    },

    get_product: function(product_id){
        // Do AJAX
        $.ajax({
            url: config.productSummary_url,
            type: "GET",
            cache: false,
            data:{
                "product_id" : product_id
            },
            success: function(data){
                var data = JSON.parse(data);
                var parent_form = $('#edit-product');
                var images = data.imageCollection;
                var videos = data.videoCollection;
                var image_list = '';
                var video_list = '';
                var hidden_inputs =
                    '<input name="productId" type="hidden" value="'+data.id+'">'+
                    '<input name="name" type="hidden" value="'+data.name+'">'+
                    '<input name="type" type="hidden" value="'+data.type+'">'+
                    '<input name="breed" type="hidden" value="'+data.breed+'">';

                $(parent_form).append('<input name="productId" type="hidden" value="'+data.id+'">');
                $('#edit-media-dropzone').append(hidden_inputs);
                $('#edit-media-modal h4').html('Edit Media of '+data.name);

                // General input initialization
                parent_form.find("input[name='edit-name']").val(data.name);
                parent_form.find("label[for='edit-name']").addClass('active')
                parent_form.find("input[name='edit-price']").val(data.price);
                parent_form.find("label[for='edit-price']").addClass('active');
                parent_form.find("input[name='edit-birthdate']").val(data.birthdate);
                parent_form.find("label[for='edit-birthdate']").addClass('active');
                parent_form.find("input[name='edit-adg']").val(data.adg);
                parent_form.find("label[for='edit-adg']").addClass('active');
                parent_form.find("input[name='edit-fcr']").val(data.fcr);
                parent_form.find("label[for='edit-fcr']").addClass('active');
                parent_form.find("input[name='edit-backfat_thickness']").val(data.backfat_thickness);
                parent_form.find("label[for='edit-backfat_thickness']").addClass('active');

                // For select initializations
                $('#edit-select-type').val(data.type.toLowerCase());
                $('#edit-select-farm').val(data.farm_from_id);
                $('select').material_select();

                // For the breed initialization
                if(data.breed.includes('x')){
                    var crossbreed = data.breed.split('x');

                    // Check the crossbreed radio
                    $('#edit-crossbreed').prop('checked',true);

                    parent_form.find("input[name='edit-fbreed']").val(crossbreed[0].toString().trim());
                    parent_form.find("label[for='edit-fbreed']").addClass('active');
                    parent_form.find("input[name='edit-mbreed']").val(crossbreed[1].toString().trim());
                    parent_form.find("label[for='edit-mbreed']").addClass('active');
                    parent_form.find('.input-purebreed-container').hide();
                    parent_form.find('.input-crossbreed-container').fadeIn(300);
                }
                else {
                    // Check the crossbreed radio
                    $('#edit-purebreed').prop('checked',true);

                    parent_form.find("input[name='edit-breed']").val(data.breed);
                    parent_form.find("label[for='edit-breed']").addClass('active');
                    parent_form.find('.input-crossbreed-container').hide();
                    parent_form.find('.input-purebreed-container').fadeIn(300);
                }

                // Other Details
                if(data.other_details){
                    var other_details_info = data.other_details.split(',');
                    var details = '';
                    other_details_info.forEach(function(element){
                        var information = element.split('=');
                        if(information != ''){
                            details += '<div class="detail-container">'+
                                    '<div class="input-field col s6">'+
                                        '<input class="validate" name="characteristic[]" type="text" value="'+ information[0].toString().trim() +'">'+
                                        '<label for="characteristic[]" class="active">Characteristic</label>'+
                                    '</div>'+
                                    '<div class="input-field col s5">'+
                                        '<input class="validate" name="value[]" type="text" value="'+ information[1].toString().trim() +'">'+
                                        '<label for="value[]" class="active">Value</label>'+
                                    '</div>'+
                                    '<div class="input-field col s1 remove-button-container">'+
                                        '<a href="#" class="tooltipped remove-detail" data-position="top" data-delay="50" data-tooltip="Remove detail">'+
                                            '<i class="material-icons grey-text text-lighten-1">remove_circle</i>'+
                                        '</a>'+
                                    '</div>'+
                                '</div>';
                        }
                    });

                    parent_form.find('.other-details-container').html('');
                    $(details).prependTo(parent_form.find(".other-details-container")).fadeIn(300);

                    // Open Edit Product Modal after product information has been fetched
                    $('#edit-product-modal').modal({
                        ready: function(){
                            var whole_tab_width = $('#edit-product-modal .tabs').width();
                            var swine_tab_width = $('#edit-product-modal .tab').first().width();

                            $('.indicator').css({"right": whole_tab_width - swine_tab_width, "left": "0px"});
                        }
                    });
                    $('#edit-product-modal').modal('open');

                    // Set-up value of current_modal_id
                    product.modal_history.push('#edit-product-modal');

                    // Set-up Images in Edit Media Modal
                    images.forEach(function(element){
                        var anchor_tag_html = 'Set as Display Photo';

                        // Change html value of set-display-photo anchor tag if image is the display photo
                        if(element.id == data.primary_img_id){
                            product.current_display_photo = element.id;
                            anchor_tag_html = '<i class="material-icons left teal-text">photo</i> Display Photo';
                        }

                        image_list += '<div class="col s12 m6">'+
                                '<div class="card">'+
                                    '<div class="card-image">'+
                                        '<img src="'+config.productImages_path+'/'+element.name+'">'+
                                        '<span class="card-title"></span>'+
                                    '</div>'+
                                    '<div class="card-action">'+
                                        '<a href="#!" class="set-display-photo btn-flat" data-product-id="'+data.id+'" data-img-id="'+element.id+'">'+ anchor_tag_html +'</a>'+
                                        '<a href="#!" class="delete-image btn-flat" data-media-id="'+element.id+'">Delete</a>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                    });

                    // Set-up Videos in Edit Media Modal
                    videos.forEach(function(element){
                        video_list += '<div class="col s12 m6">'+
                                '<div class="card">'+
                                    '<div class="card-image">'+
                                        '<video class="responsive-video" controls>'+
                                            '<source src="'+config.productVideos_path+'/'+element.name+'" type="video/mp4">'+
                                        '</video>'+
                                    '</div>'+
                                    '<div class="card-action">'+
                                        '<a></a>'+
                                        '<a href="#!" class="delete-video right" data-media-id="'+element.id+'">Delete</a>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                    });

                    $('#edit-images-summary .card-content .row').html(image_list);
                    $('#edit-videos-summary .card-content .row').html(video_list);
                }

            },
            error: function(message){
                console.log(message['responseText']);
            }
        });
    },

    get_summary: function(product_id){
        $(product.modal_history_tos()).modal('close');

        // Set-up first modal action buttons depending
        // on what modal it came from
        if(product.modal_history_tos().includes('add')){
            $('.from-add-process').show();
            $('.from-edit-process').hide();
        }
        else {
            $('.from-add-process').hide();
            $('.from-edit-process').show();
        }

        $('#product-summary-modal').modal({ dismissible: false });
        $('#product-summary-modal').modal('open');
        product.modal_history.push('#product-summary-modal');

        // Attach overlay preloader
        $('<div id="overlay-preloader-circular" class="valign-wrapper" style="padding:7rem;">'+
            '<div class="center-align preloader-overlay">'+
                '<div class="preloader-wrapper big active">'+
                    '<div class="spinner-layer spinner-blue-only">'+
                        '<div class="circle-clipper left">'+
                          '<div class="circle"></div>'+
                        '</div><div class="gap-patch">'+
                          '<div class="circle"></div>'+
                        '</div><div class="circle-clipper right">'+
                          '<div class="circle"></div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>')
        .css({
            position: "absolute", width: "100%", height: "100%", top: $('#add-product-modal .modal-content').scrollTop(), left: 0, background: "rgba(255,255,255,0.8)", display:"block"
        })
        .appendTo($("#product-summary-modal .modal-content").css("position", "relative"));

        // Let the overlay preloader change its top position every scroll
        $('#product-summary-modal .modal-content').scroll(function(){
            $('#overlay-preloader-circular').css({top:$(this).scrollTop()});
        });

        // Do AJAX
        $.ajax({
            url: config.productSummary_url,
            type: "GET",
            cache: false,
            data:{
                "product_id" : product_id
            },
            success: function(data){
                var data = JSON.parse(data);
                var other_details = data.other_details.split(',');
                var images = data.imageCollection;
                var videos = data.videoCollection;

                // General Info
                var items = '<li class="collection-item">'+data.type+' - '+data.breed+'</li>'+
    				'<li class="collection-item">Born on '+data.birthdate+'</li>'+
    				'<li class="collection-item">Average Daily Gain: '+data.adg+' g</li>'+
    				'<li class="collection-item">Feed Conversion Ratio: '+data.fcr+'</li>' +
                    '<li class="collection-item">Backfat Thickness: '+data.backfat_thickness+' mm</li>';

                var other_details_list = '<p>';
                var image_list = '';
                var video_list = '';

                // Other Details
                other_details.forEach(function(element){ other_details_list += element.trim() + '<br>'; });
                other_details_list += '</p>';

                // Images
                images.forEach(function(element){
                    var anchor_tag_html = 'Set as Display Photo';

                    // Change html value of set-display-photo anchor tag if image is the display photo
                    if(element.id == data.primary_img_id){
                        product.current_display_photo = element.id;
                        anchor_tag_html = '<i class="material-icons left teal-text">photo</i> Display Photo';
                    }

                    image_list += '<div class="col s12 m6">'+
                            '<div class="card">'+
                                '<div class="card-image">'+
                                    '<img src="'+config.productImages_path+'/'+element.name+'">'+
                                    '<span class="card-title"></span>'+
                                '</div>'+
                                '<div class="card-action">'+
                                    '<a href="#!" class="set-display-photo btn-flat" data-product-id="'+data.id+'" data-img-id="'+element.id+'">'+ anchor_tag_html +'</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                });

                // Videos
                videos.forEach(function(element){
                    video_list += '<div class="col s12 m6">'+
                            '<video class="responsive-video" controls>'+
                                '<source src="'+config.productVideos_path+'/'+element.name+'" type="video/mp4">'+
                            '</video>'+
                        '</div>';
                });

                $('#product-summary-collection h5').html(data.name);
                $('#product-summary-collection h6').html(data.farm_province);
                $('#product-summary-collection div').html(items);
                $('#other-details-summary .card-content div').html(other_details_list);
                $('#images-summary .card-content .row').html(image_list);
                $('#videos-summary .card-content .row').html(video_list);
                $('#display-product-form').prepend('<input name="productId" type="hidden" value="'+data.id+'">');
                $('#overlay-preloader-circular').remove();

            },
            error: function(message){
                console.log(message['responseText']);
            }
        });
    },

    set_display_photo: function(anchor_tag, parent_form, product_id, img_id){
        // Disable the Display photo anchor tag
        anchor_tag.addClass('disabled');
        anchor_tag.html('Setting ...');

        // Do AJAX
        $.ajax({
            url: parent_form.attr('action'),
            type: "POST",
            cache: false,
            data: {
                "_token": parent_form.find('input[name=_token]').val(),
                "product_id": product_id,
                "img_id": img_id
            },
            success: function(data){
                // Overwrite the old display photo's anchor description
                parent_form.find('.set-display-photo[data-img-id="'+product.current_display_photo+'"]').html('Set as Display Photo');

                // New Display Photo id
                product.current_display_photo = img_id;
                anchor_tag.removeClass('disabled');
                anchor_tag.html('<i class="material-icons left teal-text">photo</i> Display Photo');
            },
            error: function(message){
                console.log(message['responseText']);
            }
        });
    },

    display_product: function(parent_form){
        // Do AJAX
        $.ajax({
            url: parent_form.attr('action'),
            type: "POST",
            cache: false,
            data: {
                "_token": parent_form.find('input[name=_token]').val(),
                "product_id": parent_form.find('input[name=productId]').val()
            },
            success: function(data){
                window.setTimeout(function(){
                    location.reload(true);
                }, 1200);
            },
            error: function(message){
                console.log(message['responseText']);
            }
        });
    },

    update_selected: function(parent_form, update_button, products, status){
        // Check if there are checked products
        if(products.length > 0){
            config.preloader_progress.fadeIn();
            // Do AJAX
            $.ajax({
                url: parent_form.attr('action'),
                type: "POST",
                cache: false,
                data: {
                    "_token": parent_form.find('input[name=_token]').val(),
                    "product_ids": products,
                    "updateTo_status": status
                },
                success: function(data){
                    var filter_status = $('#status-select option:selected').val();

                    // Do not remove product card if the filter enables
                    // all product statuses (hidden & displayed)
                    if(filter_status == "all-status"){
                        var product_name = update_button.attr('data-product-name');

                        if(status == 'display'){
                            update_button.removeClass('display-product-button');
                            update_button.addClass('hide-product-button');
                            update_button.attr('data-tooltip','Hide '+product_name);
                            update_button.tooltip({delay:50});
                            update_button.find('.material-icons').html('visibility_off');
                            update_button.parents('.card').find('.card-image img').removeClass('hidden');
                        }
                        else{
                            update_button.removeClass('hide-product-button');
                            update_button.addClass('display-product-button');
                            update_button.attr('data-tooltip','Display '+product_name);
                            update_button.tooltip({delay:50});
                            update_button.find('.material-icons').html('visibility');
                            update_button.parents('.card').find('.card-image img').addClass('hidden');
                        }
                    }
                    else{
                        products.forEach(function(element){
                            $('#product-'+element).remove();
                        });
                    }
                    config.preloader_progress.fadeOut();
                    Materialize.toast('Selected Products updated!', 2000, 'green lighten-1');
                },
                error: function(message){
                    console.log(message['responseText']);
                }
            });
        }
        else Materialize.toast('No products chosen!', 1500 , 'orange accent-2');

    },

    manage_necessary_fields: function(parent_form, type){

        if(type === 'semen'){
            if(product.before_select_value === 'sow' || product.before_select_value === 'gilt'){
                parent_form.find('.other-details-container').html('');
                $(product.other_details_default).prependTo(parent_form.find(".other-details-container")).fadeIn(300);
            }
            product.before_select_value = 'semen';
        }
        // Provide default values in other_details category for sow
        else if(type === 'sow' || type === 'gilt'){
            parent_form.find('.other-details-container').html('');
            $('<div class="detail-container">'+
                    '<div class="input-field col s6">'+
                        '<input class="validate valid" name="characteristic[]" type="text" value="Litter Size">'+
                        '<label for="characteristic[]" class="active">Characteristic</label>'+
                    '</div>'+
                    '<div class="input-field col s5">'+
                        '<input class="validate" name="value[]" type="text" value="">'+
                        '<label for="value[]" class="active">Value</label>'+
                    '</div>'+
                    '<div class="input-field col s1 remove-button-container">'+
                        '<a href="#" class="tooltipped remove-detail" data-position="top" data-delay="50" data-tooltip="Remove detail">'+
                            '<i class="material-icons grey-text text-lighten-1">remove_circle</i>'+
                        '</a>'+
                    '</div>'+
                '</div>'+
            '<div class="detail-container">'+
                    '<div class="input-field col s6">'+
                        '<input class="validate valid" name="characteristic[]" type="text" value="Number of teats">'+
                        '<label for="characteristic[]" class="active">Characteristic</label>'+
                    '</div>'+
                    '<div class="input-field col s5">'+
                        '<input class="validate" name="value[]" type="text" value="">'+
                        '<label for="value[]" class="active">Value</label>'+
                    '</div>'+
                    '<div class="input-field col s1 remove-button-container">'+
        '                <a href="#" class="tooltipped remove-detail" data-position="top" data-delay="50" data-tooltip="Remove detail">'+
                            '<i class="material-icons grey-text text-lighten-1">remove_circle</i>'+
                        '</a>'+
                    '</div>'+
                '</div>').hide().prependTo(parent_form.find(".other-details-container")).fadeIn(300);

            parent_form.find('.remove-detail').tooltip({delay:50});
            product.before_select_value = type;
        }

        // Boar
        else{
            if(product.before_select_value === 'sow' || product.before_select_value === 'gilt'){
                parent_form.find('.other-details-container').html('');
                $(product.other_details_default).prependTo(parent_form.find(".other-details-container")).fadeIn(300);
            }
            product.before_select_value = 'boar';
        }
    },

    add_other_detail : function(parent_form){
        $(product.other_details_default).hide().appendTo(parent_form.find(".other-details-container")).fadeIn(300);
        $('.remove-detail').tooltip({delay:50});
    },

    remove_other_detail : function(remove_icon){
        var parent_container = remove_icon.parents('.detail-container');
        remove_icon.tooltip('remove');
        $.when(parent_container.fadeOut(300)).done(function(){
            parent_container.remove();
        });

    }

};

'use strict';

var filter = {
    apply: function(){
        // URL search syntax: ?type=value[+value]*&status=value[+value]&sort=value*
        var filter_parameters = '?';
        var type_url = 'type=';
        var status_url = '&status=';
        var sort_url = '&sort=';

        // Type parameter
        type_url += $('#type-select option:selected').val();

        // Status parameter
        status_url += $('#status-select option:selected').val();

        // Sort parameter
        sort_url += $('#sort-select option:selected').val();

        filter_parameters += type_url + status_url + sort_url;

        window.location = config.manageProducts_url+filter_parameters;

    }
};

$(document).ready(function(){

    // Variable for checking if all products
    // are selected or not
    var all_checked = false;

    // Hide certain elements
    $('.input-crossbreed-container').hide();

    // initialization of Materialize's Date Picker
    $('.datepicker').pickadate({
        max: true,
        selectMonths: true,
        selectYears: 4,
        format: 'mmmm d, yyyy'
    });

    /* ----------- Manage Products page general functionalities ----------- */
    // Back to top button functionality
    $(window).scroll(function(){
        if ($(this).scrollTop() >= 250) $('#action-button').fadeIn(200);
        else{
            $('.fixed-action-btn').closeFAB();
            $('#action-button').fadeOut(200);
        }
    });

    // Select All Products
    $('.select-all-button').click(function(e){
        e.preventDefault();

        if(!all_checked){
            $('#view-products-container input[type=checkbox]').prop('checked', true);
            $('.select-all-button i').html('event_busy');
            $('.select-all-button').attr('data-tooltip', 'Unselect all Products');
            all_checked = true;
        }
        else{
            $('#view-products-container input[type=checkbox]').prop('checked', false);
            $('.select-all-button i').html('event_available');
            $('.select-all-button').attr('data-tooltip', 'Select all Products');
            all_checked = false;
        }
    });

    // Display Selected Button
    $('.display-selected-button').click(function(e){
        e.preventDefault();
        var checked_products = [];

        $('#view-products-container input[type=checkbox]:checked').each(function(){
            checked_products.push($(this).attr('data-product-id'));
        });
        product.update_selected($('#manage-selected-form'), '', checked_products, 'display');
    });

    // Hide Selected Button
    $('.hide-selected-button').click(function(e){
        e.preventDefault();
        var checked_products = [];

        $('#view-products-container input[type=checkbox]:checked').each(function(){
            checked_products.push($(this).attr('data-product-id'));
        });
        product.update_selected($('#manage-selected-form'), '', checked_products, 'hide');
    });

    // Delete selected products
    $(".delete-selected-button").click(function(e){
        e.preventDefault();
        var checked_products = [];

        $('#view-products-container input[type=checkbox]:checked').each(function(){
            checked_products.push($(this).attr('data-product-id'));
        });
        product.delete_selected($('#manage-selected-form'), checked_products);
    });

    // Display chosen product
    $('body').on('click', '.display-product-button' ,function(e){
        e.preventDefault();
        $(this).tooltip('remove');
        product.update_selected($('#manage-selected-form'), $(this), [$(this).attr('data-product-id')], 'display');
    });

    // Hide chosen product
    $('body').on('click', '.hide-product-button' ,function(e){
        e.preventDefault();
        $(this).tooltip('remove');
        product.update_selected($('#manage-selected-form'), $(this), [$(this).attr('data-product-id')], 'hide');
    });

    // Add a product
    $('.add-product-button').click(function(){
        $('#add-product-modal').modal({
            ready: function(){
                // Programmatically select th 'swine-information' tab
                $('#add-product-modal ul.tabs').tabs('select_tab', 'swine-information');
            }
        });
        $('#add-product-modal').modal('open');
        product.modal_history.push('#add-product-modal');
    });

    // Edit chosen product
    $('.edit-product-button').click(function(){
        $('#edit-product-modal').modal({
            ready: function(){
                // Programmatically select the 'edit-swine-information' tab
                $('#edit-product-modal ul.tabs').tabs('select_tab', 'edit-swine-information');
            }
        });
        $('#edit-product-modal').modal('open');
        product.get_product($(this).attr('data-product-id'));
    });

    // Delete chosen product
    $('.delete-product-button').click(function(e){
        e.preventDefault();
        product.delete_selected($('#manage-selected-form'), [$(this).attr('data-product-id')]);
    });

    // Redirect to designated link upon checkbox value change
    $("#dropdown-container select").change(function(){
        filter.apply();
    });

    // Back button on modals
    $('.back-button').click(function(e){
        e.preventDefault();

        $(product.modal_history.pop()).modal('close');

        // If going back to add-product-modal it must be directed to edit-product-modal
        if(product.modal_history_tos() === '#add-product-modal') {
            product.get_product($('#add-media-modal form').find('input[name="productId"]').val());

            // Set-up first modal action buttons
            if(product.modal_history_tos().includes('add')){
                $('.from-add-process').show();
                $('.from-edit-process').hide();
            }
            else {
                $('.from-add-process').hide();
                $('.from-edit-process').show();
            }
        }
        else $(product.modal_history_tos()).modal('open');
    });

    /* ----------- Add Product Modal functionalities ----------- */
    $("#add-product-modal #other-details-tab").click(function(e){
        $('#submit-button').show();
    });

    /* ----------- Add Media Modal functionalities ----------- */
    // Move to Product Summary Modal
    $('#next-button').click(function(e){
        e.preventDefault();
        product.get_summary($('#add-media-modal form').find('input[name="productId"]').val());
    });

    // media-dropzone initialization and configuration
    Dropzone.options.mediaDropzone = {
        paramName: 'media',
        uploadMultiple: true,
        parallelUploads: 1,
        maxFiles: 12,
        maxFilesize: 50,
        acceptedFiles: "image/png, image/jpeg, image/jpg, video/avi, video/mp4, video/flv, video/mov",
        dictDefaultMessage: "<h5 style='font-weight: 300;'> Drop images/videos here to upload </h5>"+
            "<i class='material-icons'>insert_photo</i> <i class='material-icons'>movie</i>"+
            "<br> <h5 style='font-weight: 300;'> Or just click anywhere in this container to choose file </h5>",
        previewTemplate: document.getElementById('custom-preview').innerHTML,
        init: function() {
            // Listen to events
            // Set default thumbnail for videos
            this.on("addedfile", function(file) {
                if (file.type.match(/video.*/)) this.emit("thumbnail", file, config.images_path+'/video-icon.png');
            });

            // Inject attributes on element upon success of multiple uploads
            this.on('successmultiple', function(files, response){
                response = JSON.parse(response);
                var item = 0;
                response.forEach(function(element){
                    var preview_element = files[item].previewElement;
                    preview_element.setAttribute('data-media-id', element.id);
                    preview_element.getElementsByClassName('dz-filename')[0].getElementsByTagName('span')[0].innerHTML = element.name;
                    item++;
                });

                $(".tooltipped").tooltip({delay:50});
            });

            // Remove file from file system and database records
            this.on('removedfile', function(file){
                var mime_type = file.type.split('/');
                var media_type = mime_type[0];
                // Do AJAX
                $.ajax({
                    url: config.productMedia_url+'/delete',
                    type: "DELETE",
                    cache: false,
                    data:{
                        "_token" : $('#media-dropzone').find('input[name=_token]').val(),
                        "mediaId" : file.previewElement.getAttribute('data-media-id'),
                        "mediaType" : media_type
                    },
                    success: function(data){

                    },
                    error: function(message){
                        console.log(message['responseText']);
                    }
                });
            });
        }
    };

    /* ----------- Product Summary Product Modal functionalities ----------- */
    // Save as Draft the Product created
    $('#save-draft-button').click(function(e){
        e.preventDefault();

        // Disable save-draft-button and display-button
        $('#display-button').addClass('disabled');
        $(this).addClass('disabled');
        $(this).html('Saving as Draft ...');

        window.setTimeout(function(){
            location.reload(true);
        }, 1200);

    });

    // Display Product created
    $('#display-button').click(function(e){
        e.preventDefault();

        // Disable display-button and save-draft-button
        $('#save-draft-button').addClass('disabled');
        $(this).addClass('disabled');
        $(this).html('Displaying ...');

        product.display_product($(this).parents('form'));
    });

    // Change html of set-display-photo anchor tag if it is a display photo
    $('body').on('click', '.set-display-photo' ,function(e){
        e.preventDefault();

        // Check first if chosen image not the current primary picture
        if(product.current_display_photo != $(this).attr('data-img-id')){
            product.set_display_photo($(this), $(this).parents('form'), $(this).attr('data-product-id'), $(this).attr('data-img-id'));
        }
    });

    $('#save-button').click(function(e){
        e.preventDefault();

        // Disable save-button
        $(this).addClass('disabled');
        $(this).html('Saving ...');

        window.setTimeout(function(){
            location.reload(true);
        }, 1200);
    });

    /* ----------- Edit Product Modal functionalities ----------- */
    // Open Edit Media Modal
    $('#edit-media-button').click(function(e){
        e.preventDefault();
        $('#edit-product-modal').modal('close');
        $('#edit-media-modal').modal({dismissible: false});
        $('#edit-media-modal').modal('open');
        product.modal_history.push('#edit-media-modal')
    });

    // Open Add Media Modal
    $('#add-media-button').click(function(e){
        e.preventDefault();
        $('#edit-product-modal').modal('close');
        $('#add-media-modal').modal({
            dismissible: false,
            ready: function(){
                product.modal_history.push('#add-media-modal');
            }
        });
        $('#add-media-modal').modal('open');
    });

    /* ----------- Edit Media Modal ----------- */
    // edit-media-dropzone initialization and configuration
    Dropzone.options.editMediaDropzone = {
        paramName: 'media',
        uploadMultiple: true,
        parallelUploads: 1,
        maxFiles: 12,
        maxFilesize: 50,
        acceptedFiles: "image/png, image/jpeg, image/jpg, video/avi, video/mp4, video/flv, video/mov",
        dictDefaultMessage: "<h5 style='font-weight: 300;'> Drop images/videos here to upload </h5>"+
            "<i class='material-icons'>insert_photo</i> <i class='material-icons'>movie</i>"+
            "<br> <h5 style='font-weight: 300;'> Or just click anywhere in this container to choose file </h5>",
        previewTemplate: document.getElementById('custom-preview').innerHTML,
        init: function() {
            // Listen to events

            // Set default thumbnail for videos
            this.on("addedfile", function(file) {
                if (file.type.match(/video.*/)) this.emit("thumbnail", file, config.images_path+'/video-icon.png');
            });

            // Inject attributes on element upon success of multiple uploads
            this.on('successmultiple', function(files, response){
                response = JSON.parse(response);
                var item = 0;
                response.forEach(function(element){
                    var preview_element = files[item].previewElement;
                    preview_element.setAttribute('data-media-id', element.id);
                    preview_element.getElementsByClassName('dz-filename')[0].getElementsByTagName('span')[0].innerHTML = element.name;
                    item++;
                });

                $(".tooltipped").tooltip({delay:50});
            });

            // Remove file from file system and database records
            this.on('removedfile', function(file){
                var mime_type = file.type.split('/');
                var media_type = mime_type[0];
                // Do AJAX
                $.ajax({
                    url: config.productMedia_url+'/delete',
                    type: "DELETE",
                    cache: false,
                    data:{
                        "_token" : $('#media-dropzone').find('input[name=_token]').val(),
                        "mediaId" : file.previewElement.getAttribute('data-media-id'),
                        "mediaType" : media_type
                    },
                    success: function(data){

                    },
                    error: function(message){
                        console.log(message['responseText']);
                    }
                });
            });
        }
    };

    // Delete image / Delete video button
    $('body').on('click', '.delete-image, .delete-video' ,function(e){
        e.preventDefault();

        // Disable delete-image/delete-video button
        $(this).addClass('disabled');
        $(this).html('Deleting ...');

        var card_container = $(this).parents('.card').first().parent();
        var data_values = {
            "_token" : $('#media-dropzone').find('input[name=_token]').val(),
            "mediaId" : $(this).attr('data-media-id')
        };

        // Check if the chosen media is an image and is the current display photo
        if($(this).hasClass('delete-image') && $(this).attr('data-media-id') == product.current_display_photo){
            Materialize.toast('Cannot delete display photo!', 1500 , 'orange accent-2');

            // Enable delete-image/delete-video button
            $(this).removeClass('disabled');
            $(this).html('Delete');
        }
        else{
            // Initialize mediaType value
            if($(this).hasClass('delete-image')) data_values["mediaType"] = 'image';
            else data_values["mediaType"] = 'video';

            // Do AJAX
            $.ajax({
                url: config.productMedia_url+'/delete',
                type: "DELETE",
                cache: false,
                data: data_values,
                success: function(data){
                    card_container.remove();
                },
                error: function(message){
                    console.log(message['responseText']);
                }
            });
        }

    });


    /* ----------- Form functionalities ----------- */
    // Breed radio
    $("input.purebreed").on('click', function(){
        $(this).parents('form').find('.input-crossbreed-container').hide();
        $(this).parents('form').find('.input-purebreed-container').fadeIn(300);
    });
    $("input.crossbreed").on('click', function(){
        $(this).parents('form').find('.input-purebreed-container').hide();
        $(this).parents('form').find('.input-crossbreed-container').fadeIn(300);
    });

    // Manage necessary fields depending on product type
    $("#select-type").on('change', function(){
        product.manage_necessary_fields($(this).parents('form'), $(this).val());
    });
    $("#edit-select-type").on('change', function(){
        product.manage_necessary_fields($(this).parents('form'), $(this).val());
    });

    // Add other details button
    $(".add-other-details").click(function(e){
        e.preventDefault();
        product.add_other_detail($(this).parents('form'));
    });

    // Remove a detail from other details section
    $('body').on('click', '.remove-detail' ,function(e){
        e.preventDefault();
        product.remove_other_detail($(this));
    });


});

'use strict';

// Place error on specific HTML input
var placeError = function(inputElement, errorMsg){
    // Parse id of element if it contains '-' for the special
    // case of finding the input's respective
    // label on editProfile pages
    var inputId = (inputElement.id.includes('-') && /\d/.test(inputElement.id))
        ? (inputElement.id.split('-')[2])
        : inputElement.id;

    $(inputElement)
        .parents("form")
        .find("label[for='" + inputId + "']")
        .attr('data-error', errorMsg);

    setTimeout(function(){
        if(inputElement.id.includes('select')){
            // For select input, find first its respective input text
            // then add the 'invalid' class
            $(inputElement)
                .parents('.select-wrapper')
                .find('input.select-dropdown')
                .addClass('invalid');
        }
        else $(inputElement).addClass('invalid');
    },0);
};

// Place success from specific HTML input
var placeSuccess = function(inputElement){

    // For select input, find first its respective input text
    // then add the needed classes
    var inputTextFromSelect = (inputElement.id.includes('select')) ? $(inputElement).parents('.select-wrapper').find('input.select-dropdown') : '';

    // Check first if it is invalid
    if($(inputElement).hasClass('invalid') || $(inputTextFromSelect).hasClass('invalid')){
        $(inputElement)
            .parents("form")
            .find("label[for='" + inputElement.id + "']")
            .attr('data-error', false);

        setTimeout(function(){
            if(inputElement.id.includes('select')) inputTextFromSelect.removeClass('invalid').addClass('valid');
            else $(inputElement).removeClass('invalid').addClass('valid');
        },0);
    }
    else {
        if(inputElement.id.includes('select')) inputTextFromSelect.addClass('valid');
        else $(inputElement).addClass('valid');
    }
}

var validationMethods = {
    // functions must return either true or the errorMsg only
    required: function(inputElement){
        var errorMsg = 'This field is required';
        return inputElement.value ? true : errorMsg;
    },
    requiredIfRadio: function(inputElement, radioId){
        var errorMsg = 'This field is required';
        var radioInputElement = document.getElementById(radioId);
        if(radioInputElement.checked) return inputElement.value ? true : errorMsg;
        else return true;
    },
    requiredDropdown: function(inputElement){
        var errorMsg = 'This field is required';
        return inputElement.value ? true : errorMsg;
    },
    email: function(inputElement){
        var errorMsg = 'Please enter a valid email address';
        return /\S+@\S+\.\S+/.test(inputElement.value) ? true : errorMsg;
    },
    minLength: function(inputElement, min){
        var errorMsg = 'Please enter ' + min + ' or more characters';
        return (inputElement.value.length >= min) ? true : errorMsg;
    },
    equalTo: function(inputElement, compareInputElementId){
        var errorMsg = 'Please enter the same value';
        var compareInputElement = document.getElementById(compareInputElementId);
        return (inputElement.value === compareInputElement.value) ? true : errorMsg;
    },
    zipCodePh: function(inputElement){
        var errorMsg = 'Please enter zipcode of 4 number characters';
        return (/\d{4}/.test(inputElement.value) && inputElement.value.length === 4) ? true : errorMsg;
    },
    phoneNumber: function(inputElement){
        var errorMsg = 'Please enter 11-digit phone number starting with 09';
        return (/^09\d{9}/.test(inputElement.value) && inputElement.value.length === 11)  ? true : errorMsg;
    }

};

'use strict';

var validateFunction = function(){

    return function(){
        var validateInput = function(inputElement, modal){

            // Initialize needed validations
            var validations = {
                name: ['required'],
                breed: ['requiredIfRadio:purebreed'],
                fbreed: ['requiredIfRadio:crossbreed'],
                mbreed: ['requiredIfRadio:crossbreed'],
                'select-type': ['requiredDropdown'],
                'select-farm': ['requiredDropdown'],
                'edit-name': ['required'],
                'edit-breed': ['requiredIfRadio:edit-purebreed'],
                'edit-fbreed': ['requiredIfRadio:edit-crossbreed'],
                'edit-mbreed': ['requiredIfRadio:edit-crossbreed'],
                'edit-select-type': ['requiredDropdown'],
                'edit-select-farm': ['requiredDropdown'],
            };

            // Check if validation rules exist
            if(validations[inputElement.id]){
                var result = true;

                for (var i = 0; i < validations[inputElement.id].length; i++) {
                    var element = validations[inputElement.id][i];

                    // Split arguments if there are any
                    var method = element.includes(':') ? element.split(':') : element;

                    result = (typeof(method) === 'object')
                        ? (validationMethods[method[0]](inputElement, method[1]))
                        : (validationMethods[method](inputElement));

                    // Result would return to a string errorMsg if validation fails
                    if(result !== true){
                        placeError(inputElement, result);
                        return false;
                    }
                }

                // If all validations succeed then
                if(result === true){
                    placeSuccess(inputElement);
                    return true;
                }
            }
        };

        // focusout events on add-product-modal
        $('body').on('focusout', '#add-product-modal input', function(e){
            validateInput(this, 'add-product-modal');
        });

        // keyup events on add-product-modal
        $('body').on('keyup', '#add-product-modal input', function(e){
            if($(this).hasClass('invalid') || $(this).hasClass('valid')) validateInput(this, 'add-product-modal');
        });

        // focusout and keyup events on add-product-modal
        $('body').on('focusout keyup', '#edit-product-modal input', function(e){
            validateInput(this, 'edit-product-modal');
        });

        // select change events
        $('select').change(function(){
            validateInput(this);
        });

        // Remove respective 'invalid' class and input text value
        // of current radio when radio value changes
        $("#create-product input[name='radio-breed']").change(function(){
            if($("#create-product input:checked").val() === 'crossbreed'){
                $('input#breed').val('');
                $('input#breed').removeClass('valid invalid');
            }
            else{
                $('input#fbreed, input#mbreed').val('');
                $('input#fbreed, input#mbreed').removeClass('valid invalid');
            }
        });

        // Temporary fix for prompting 'valid' class after
        // value change on datepicker
        $('#birthdate, #edit-birthdate').change(function(e){
            e.stopPropagation();
            $(this).removeClass('invalid').addClass('valid');
        });

        // Submit add product
        $("#create-product").submit(function(e){
            e.preventDefault();

            var validName = validateInput(document.getElementById('name'));
            var validType = validateInput(document.getElementById('select-type'));
            var validFarmFrom = validateInput(document.getElementById('select-farm'));
            var validBreed = true;

            // Validate appropriate breed input/s according to chosen radio breed value
            if($('#create-product input:checked').val() === 'crossbreed'){
                var validFbreed = validateInput(document.getElementById('fbreed'));
                var validMbreed = validateInput(document.getElementById('mbreed'));
                validBreed = validBreed &&  validFbreed &&  validMbreed;
            }
            else validBreed = validateInput(document.getElementById('breed'));

            if(validName && validType && validFarmFrom && validBreed){
                // Disable submit/add product button
                $('#submit-button').addClass('disabled');
                $('#submit-button').html('Adding Product ...');

                product.add($('#create-product'));
            }
            else Materialize.toast('Please properly fill all required fields.', 2500, 'orange accent-2');

        });

        // Update details of a product
        $('.update-button').click(function(e){
            e.preventDefault();

            var validName = validateInput(document.getElementById('edit-name'));
            var validType = validateInput(document.getElementById('edit-select-type'));
            var validFarmFrom = validateInput(document.getElementById('edit-select-farm'));
            var validBreed = true;

            // Validate appropriate breed input/s according to chosen radio breed value
            if($('#edit-product input:checked').val() === 'crossbreed'){
                var validFbreed = validateInput(document.getElementById('edit-fbreed'));
                var validMbreed = validateInput(document.getElementById('edit-mbreed'));
                validBreed = validBreed &&  validFbreed &&  validMbreed;
            }
            else validBreed = validateInput(document.getElementById('edit-breed'));

            if(validName && validType && validFarmFrom && validBreed){
                // Disable update-button
                $(this).addClass('disabled');
                $(this).html('Updating...');

                product.edit($('#edit-product'), $(this));
            }
            else Materialize.toast('Please properly fill all required fields.', 2500, 'orange accent-2');

        });
    }
}

$(document).ready(validateFunction());

//# sourceMappingURL=showProducts.js.map
