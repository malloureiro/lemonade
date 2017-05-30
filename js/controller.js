app.factory('DataHolderModel', function() {
    var model = {
        userName: '',
        userSurname: '',
        userAddress: {
            isValid: false,
            formatted_address: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: ''
        },
        // rent/own
        ownership: '',
        optionals: {
            roommates: false,
            fire_alarm: false,
            burglar_alarm: false
        } ,
        valuables: false,
        activePolicy: false,
        policyPaymentType: '', // mortgage/none/insurer/dont_know
        property: {
            type: '', // condo/house
            buildingType: '', // studio/duplex/triplex
            use: '',
            size: '',
            loan: false
        }
    }

    var map = {
        autocomplete: null,
        infowindow: null,
        marker: null,
        map: null
    }

    var DataHolderModel = {
        model,
        map
    }

    return DataHolderModel;
});

app.controller('appController', function($scope, DataHolderModel) {

    $scope.model = DataHolderModel.model;
    $scope.map = DataHolderModel.map;
    $scope.errorMessage = "";
    $scope.buttonDisabled = true;
    $scope.meetsRequirement = false;
    $scope.infoMessage = "";

    var pageFlow = new Map();
    pageFlow.set('form-1', '#start/1');
    pageFlow.set('form-2', '#start/2');
    pageFlow.set('form-3', '#start/3');
    pageFlow.set('form-4', '#start/4');
    pageFlow.set('form-5', '#start/5');
    pageFlow.set('form-6', '#start/6');
    pageFlow.set('form-7', '#start/7');
    pageFlow.set('form-8', '#start/8');
    pageFlow.set('form-9', '#start/9');
    pageFlow.set('form-10', '#start/10');
    pageFlow.set('form-11', '#start/11');
    pageFlow.set('form-12', '#start/12');
    pageFlow.set('form-13', '#start/13');
    pageFlow.set('form-final', '#final');
    
    // Fluxo de exibição para seleção de imóvel 'Alugado'
    var renterPageFlow = ['form-1', 'form-2', 'form-3', 'form-4', 'form-5', 'form-6', 'form-final'];
    
    // Fluxo de exibição para seleção de imóvel 'Próprio' e 'Intenção de financiamento = Sim e Não'
    var ownerCondoLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12', 'form-final'];
    var ownerCondoNoLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-10', 'form-4', 'form-5', 'form-11', 'form-14', 'form-final'];

    var ownerHousePageFlow = ['form-1', 'form-2', 'form-3', 'form-7', '', '', '', '', '', '', '', '', '', ''];

    var pageId = $("section > .container-fluid").attr("id");

    $scope.goBackwards = function() {
        
        var previousPage = null;
        var routeTo = null;

        if ($scope.model.ownership == "renter") {
            var idx = renterPageFlow.indexOf(pageId);
            previousPage = renterPageFlow[idx-1];
            routeTo = pageFlow.get(previousPage);
            window.location.href = routeTo;

        } else if ($scope.model.ownership == "owner") {
            var idx = ownerPageFlow.indexOf(pageId);
            previousPage = ownerPageFlow[idx-1];
            routeTo = pageFlow.get(previousPage);
            window.location.href = routeTo;            

        } else {
            // Common routes
            switch(pageId) {
                case 'form-2':
                    window.location.href = '#start/1';
                    break;
                case 'form-3':
                    window.location.href = '#start/2';
                    break;
                default:
                    window.location.href = '#start/1';
            }
        }
    }

    $scope.validatePerson = function() {
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();

        if (firstName && lastName) {
            if (firstName.length < 2 || lastName.length < 2 ) {
                $scope.errorMessage = "Os nomes devem conter pelo menos 2 caracteres";
                $(".error-message").show();
                return;
            }
            window.location.href =  '#start/2';
        } else {
            $scope.errorMessage = "As informações devem ser preenchidas";
            $(".error-message").show();
            $("#firstName").addClass("form-control-focused");
            $("#lastName").addClass("form-control-focused");
        }
    }

    $scope.validateAddress = function() {
        var locationInput = $("#locationInput").val();
        var locationCompInput = $("#locationCompInput").val();

        if (locationCompInput) {
            $scope.model.userAddress.complemento = locationCompInput;
        }
        if (locationInput) {
            if ($scope.model.userAddress.isValid) {
                window.location.href =  '#start/3';
            } else {
                // Adicionando validação em caso de evento 'place_changed' não disparado
                $scope.errorMessage = "O endereço informado não é válido";
                $(".error-message").show();
            }
        }
    }

    $scope.validateOwnership = function() {
        var input = $("input[name='ownership']:checked").val();
        if (input) {
            $scope.model.ownership = input;

            if (input == 'renter') {
                window.location.href = "#start/4";
                $("#roommates-option").show();
            } else {
                window.location.href = "#start/7";
            }
        }
    }

    $scope.validateOptionals = function() {
        window.location.href = "#start/5";
    }

    $scope.validateValuables = function() {
        if ($scope.model.ownership == "renter") {
            window.location.href = "#start/6";
        }

        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "condo") {
                window.location.href = "#start/11";
            }
        }
    }

    $scope.validatePropertyType = function() {
        if ($scope.model.property.type == "condo") {
            window.location.href = "#start/10";
        } else {
            window.location.href = "#start/8";
        }
        
    }

    $scope.validateActivePolicy = function() {
        window.location.href = "#final";
    }

    $scope.validateSize = function() {
        var size = $scope.model.property.size;
        if (size < 10) {
            $scope.errorMessage = size + " parece ser improvável. Por favor tente novamente.";
            $(".error-message").show();
            return;
        }
        window.location.href = "#start/4";
        setTimeout(function() {
            $("#roommates-option").hide();
            var el = $("#roommates-option").parent();
            $(el).removeClass("col-xs-10 col-xs-offset-2");
            $(el).addClass("col-xs-6 col-xs-offset-3");
        }, 10);
    }

    $scope.validateLoan = function() {
        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "condo") {
                if ($scope.model.property.loan == "true") {
                    window.location.href = "#start/12";
                } else {
                    window.location.href = "#start/14";
                }
            }
        }
    }

    $scope.validatePaymentType = function() {
        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "condo") {
                if ($scope.model.property.loan == "true") {
                    window.location.href = "#final";
                }
            }
        }   
    }

    $scope.roommateChange = function() {
        if ($scope.model.optionals.roommates) {
            $scope.infoMessage = "Os itens pessoais de seus colegas de quarto não são cobertos por esta apólice";
            $("#info-bubble-row").show();
        } else {
            $("#info-bubble-row").hide();
        }
    }

    $scope.valuableChange = function() {
        if ($scope.model.valuables == "true") {
            $scope.infoMessage = "OK. Vou te mostrar como adicioná-los a sua apólice em alguns passos";
            $("#info-bubble-row").show();
        } else {
            $("#info-bubble-row").hide();
        }
    }

    $scope.activePolicyChange = function() {
        if ($scope.model.activePolicy == "true") {
            $scope.infoMessage = "Depois que você obter nosso seguro, iremos notificar seu antigo segurador para cancelar sua apólice antiga";
            $("#info-bubble-row").show();
        } else {
            $("#info-bubble-row").hide();
        }
    }

    /*
        Esta verificação deveria ser realizada através de propriedades nativas do AngularJS. Exemplo: ng-disabled.
    */
    function checkButtonDisabled() {
        /*debugger;
        var target = ".start-buttons";
        if ($scope.buttonDisabled && $scope.meetsRequirement) {
            $(target).removeClass('disabled');
            $scope.buttonDisabled = false;
        }

        var isDisabled = $(target).hasClass('disabled');
        if (isDisabled && $scope.buttonDisabled) {
            $(target).removeClass('disabled');
            $scope.buttonDisabled = false;
        }*/
    }

    // Evento no input text do Form 1
    $(document).on("input", "input[name='input-person']", function() {
        if ($(".error-message").is(":visible")) {
            $(this).removeClass("form-control-focused");
            return;
        }
        $(".error-message").hide();
    });

    // Evento no radio do Form 3
    $(document).on("change", "input[name='ownership']", function() {
        if ($("input[name='ownership']:checked").val()) {
            $scope.meetsRequirement = true;
            //checkButtonDisabled();
        }
    });    

    function reInitializeMap() {
    }

});

app.controller('mapController', function($scope, DataHolderModel) {

    $scope.model = DataHolderModel.model;
    $scope.user = $scope.model.userName;
    $scope.mapModel = DataHolderModel.map;
    $scope.errorMessage = "";

    angular.element(document).ready(function () {
        initMap();
    });

    function initMap() {

        var map = new google.maps.Map(document.getElementById('map'));
        var input = document.getElementById('locationInput');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -20)
        });

        autocomplete.addListener('place_changed', function() {
            
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                $('.container-map').hide();
                $scope.errorMessage = "O endereço informado não é válido";
                $(".error-message").show();

                // Apply necessário dentro de event listener
                $scope.$apply();
                return;
            } else {
                $(".error-message").hide();
                $scope.model.userAddress.formatted_address = place.formatted_address;
                
                if (place.address_components.length < 8) {
                    $scope.errorMessage = "O endereço informado deve conter informações de número e bairro";
                    $(".error-message").show();
                    $("#locationInput").val('');

                    $scope.$apply();
                    return;
                } else {
                    $('.container-map').show();
                    google.maps.event.trigger(map, 'resize');

                    $(".error-message").hide();
                    $scope.model.userAddress.logradouro = place.address_components[0].long_name;
                    $scope.model.userAddress.numero = place.address_components[1].long_name;
                    $scope.model.userAddress.bairro = place.address_components[2].long_name;
                    $scope.model.userAddress.cidade = place.address_components[3].long_name;
                    $scope.model.userAddress.estado = place.address_components[5].short_name;
                    $scope.model.userAddress.pais = place.address_components[6].long_name;
                    $scope.model.userAddress.cep = place.address_components[7].long_name;
                    $scope.model.userAddress.isValid = true;

                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }
                    marker.setIcon(({
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(35, 35)
                    }));
                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);

                    var address = '';
                    if (place.address_components) {
                        address = [
                          (place.address_components[0] && place.address_components[0].short_name || ''),
                          (place.address_components[1] && place.address_components[1].short_name || ''),
                          (place.address_components[2] && place.address_components[2].short_name || '')
                        ].join(' ');
                    }

                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                    infowindow.open(map, marker);
                }
            }
            $scope.mapModel.infowindow = infowindow;
            $scope.mapModel.marker = marker;
            $scope.mapModel.autocomplete = autocomplete;
            $scope.mapModel.map = map;
        });
    }

    /*
        Eventos de Input para Mapa
    */
    function toggleClass (v) {
        return v ? 'addClass' : 'removeClass';
    }


    $(document)
    .on('input', '.clearable', function() {
        $(this)[toggleClass(this.value)]('x');
    })
    .on('mousemove', '.x', function(e){
        $(this)[toggleClass(this.offsetWidth-18 < e.clientX -this.getBoundingClientRect().left)]('onX');   
    })
    .on('click', '.onX', function() {
        $(this).removeClass('x onX').val('');
        $('.container-map').hide();
        $(".error-message").hide();
    });
});
  

