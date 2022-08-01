$(function () {
    let validate = {
        init: function (param) {
            this.handleEvent()
            this.validate()
          },
          handleEvent: function () {
            let _this = this
      
            $('.header-search-Bar button').unbind().click(function (e) {
              e.stopPropagation();
            })
      
            // Ngăn ko cho reload page khi click vào icon search và in ra value đc nhập
            $(document).on('submit', '.header-search-Bar', function (e) {
              let $this = $(this)
              let $input = $this.find('input')
      
              e.preventDefault();
              console.log(`Value được nhập: ${$input.val()}`)
              console.log('-------------')
            })
      
          },
        validate: function() {
            let _this = this
            // validate thanh searchBar 
            $('.header-search-Bar').validate({
              rules: {
                "searchBar": {
                  required: true,
                }
              },  
              messages: {
                "searchBar": {
                  required: 'Bạn chưa nhập gì vào đây',
                }
              }
            })
      
            // validate form Kiểm tra đơn hàng
            $('#check-product-form').validate({
              rules: {
                "userPhoneNumber": {
                  required: true,
                  maxlength: 10,
                  minlength : 10,
                },
                "userEmail": {
                  required: true,
                  email: true
                },
                "userProductCode": {
                  required: true,
                  maxlength: 10
                },
              },
              messages: {
                "userPhoneNumber": {
                  required: 'Bạn chưa nhập số điện thoại',
                          maxlength: 'Độ dài tối đa: 10',
                          minlength : 'Tối thiểu 10 ký tự'
                },
                "userEmail": {
                  required: 'Bạn chưa nhập email',
                  email: 'Không đúng định dạng Email'
                },
                "userProductCode": {
                  required: 'Bạn chưa nhập mã đơn hàng',
                  maxlength: 'Nhập tối đa 10 ký tự'
                },
              },
            })
          },
          showProductInfo: function() {
            $('.js-submit-product-form').unbind().click(function (e) { 
              e.stopPropagation();
              let $this = $(this)
               let $container = $this.closest('.js-check-form')
               let $phoneNumber = $container.find('input[name="userPhoneNumber"]')
               let $email = $container.find('input[name="userEmail"]')
               let $productCode = $container.find('input[name="userProductCode"]')
      
              if(($phoneNumber.val() && $email.val() && $productCode.val()) == '') {
                console.log('')
              } else {
                console.log('Thông tin đơn hàng:')
                console.log(` - Số điện thoại khách hàng: ${$phoneNumber.val()}`)
                console.log(` - Email khách hàng: ${$email.val()}`)
                console.log(` - Mã đơn hàng: ${$productCode.val()}`)
                console.log('----------------')
              }
            });
          },
          showBannerTicketInfo: function() {
            $('.banner-submit-form').unbind().click(function (e) { 
              let $this = $(this)
                let $banner = $this.closest('.banner-get-value')
                let $airportValue = $banner.find('input.banner-airport-value')
                let $dateValue = $banner.find('input.date-range-picker-input')
                let $customerValue = $banner.find('input.quantity-customer')
      
                console.log('Thông tin vé: ')
      
                $($airportValue).each(function (index, element) {
                  console.log(`${$(this).data("type")} ${$(this).val()}`)  
                });
                $($dateValue).each(function (index, element) {
                  console.log(`${$(this).data("type")} ${$(this).val()}`)  
                });
                $($customerValue).each(function (index, element) {
                  console.log(`${$(this).data("type")} ${$(this).val()}`)  
                });
                
                console.log('------------------')
            });
          },
          showModalTicketInfo: function() {
            $('.book-ticket .selection-button').unbind().click(function (e) { 
              let $this = $(this)
              let $form = $this.closest('.modal-form')
              let $airport = $form.find('.form-value')
              let $date = $form.find('input[name="birthday"]')
              let $customerQuantity = $form.find('.quantity-customer')
              let $customerInfo = $form.find('.booking-infomation-input')
              let $topicQuantity = $form.find('input[name="topic"]')
              let $specialRequest = $form.find('input[name="anotherRequest"]')
      
              console.log('Thông tin vé: ')
      
              $($airport).each(function (index, element) {
                console.log(`${$(this).data("type")} ${$(this).val()}`)  
              });
              $($date).each(function (index, element) {
                console.log(`${$(this).data("type")} ${$(this).val()}`)  
              });
              $($customerQuantity).each(function (index, element) {
                console.log(`${$(this).data("type")} ${$(this).val()}`)  
              });
              $($customerInfo).each(function (index, element) {
                console.log(`${$(this).data("type")} ${$(this).val()}`)  
              });
              $($topicQuantity).each(function (index, element) {
                console.log(` Đặc biệt: ${$(this).val()}`)  
              });
              $($specialRequest).each(function (index, element) {
                console.log(`${$(this).data("type")} ${$(this).val()}`)  
              });
      
              console.log('----------------------')
            });
          },
          validateStopPlaceFilter: function() {
            $(document).on('change', '.filter-stop-straight-ahead', function (e) {
              let $this = $(this)
              let $container = $this.closest('.row')
              let $colCompare = $container.find('.validate-stop-place-filter')
              let $checkboxOfColCompare = $colCompare.find('input[type="radio"]')
              if($this.is(":checked")) {
                $($colCompare).addClass('invalid');
                
                if( $($colCompare).hasClass('invalid')) {
                  $($checkboxOfColCompare).attr('disabled', '');
                }
              } else {
                $($colCompare).removeClass('invalid');
                $($checkboxOfColCompare).removeAttr('disabled');
              }
            })

            // let $this = $('input.filter-stop-straight-ahead')
            // cons
          },
    }

    validate.init()
});