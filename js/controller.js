app.factory('DataHolderModel', function() {
    var model = {
        userName: '',
        userSurname: '',
        cpf: '',
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
        },
        debits: '' // nope/one/more
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

    var pageId = $("section > .container-fluid").attr("id");

    $scope.goBackwards = function() {
        
        var previousPage = null;
        var routeTo = null;
        var idx = null;
        if ($scope.model.ownership == "renter") {
            idx = renterPageFlow.indexOf(pageId);
            previousPage = renterPageFlow[idx-1];
            routeTo = pageFlow.get(previousPage);
            window.location.href = routeTo;

        } else if ($scope.model.ownership == "owner") {
            routeTo = '#start/3';

            if ($scope.model.property.type == "condo") {
                idx = ownerCondoPageFlow.indexOf(pageId);
                previousPage = ownerCondoPageFlow[idx-1];

                if ($scope.model.property.loan == "true") {
                    if ($scope.model.policyPaymentType == "dont_know") {
                        idx = ownerCondoLoanNoPolicyPageFlow.indexOf(pageId);
                        previousPage = ownerCondoLoanNoPolicyPageFlow[idx-1];
                    } else if ($scope.model.policyPaymentType != "") {
                        idx = ownerCondoLoanPageFlow.indexOf(pageId);
                        previousPage = ownerCondoLoanPageFlow[idx-1];
                    }
                } else if ($scope.model.property.loan == "false") {
                    idx = ownerCondoNoLoanPageFlow.indexOf(pageId);
                    previousPage = ownerCondoNoLoanPageFlow[idx-1];
                }
                routeTo = pageFlow.get(previousPage);

            } else {
                idx = ownerHousePageFlow.indexOf(pageId);
                previousPage = ownerHousePageFlow[idx-1];

                if ($scope.model.property.use == "move") {
                    idx = ownerHouseMovePageFlow.indexOf(pageId);
                    previousPage = ownerHouseMovePageFlow[idx-1];

                    if ($scope.model.property.loan == "true") {
                        idx = ownerHouseMoveLoanPageFlow.indexOf(pageId);
                        previousPage = ownerHouseMoveLoanPageFlow[idx-1];

                        if ($scope.model.policyPaymentType == "dont_know") {
                            idx = ownerHouseMoveNoPolicyPageFlow.indexOf(pageId);
                            previousPage = ownerHouseMoveNoPolicyPageFlow[idx-1];
                        } else if ($scope.model.policyPaymentType != "") {
                            idx = ownerHouseMovePolicyPageFlow.indexOf(pageId);
                            previousPage = ownerHouseMovePolicyPageFlow[idx-1];
                        }
                    }
                    if ($scope.model.property.loan == "false") {
                        idx = ownerHouseMoveNoLoanPageFlow.indexOf(pageId);
                        previousPage = ownerHouseMoveNoLoanPageFlow[idx-1];
                    }
                } else if ($scope.model.property.use != "") {
                    idx = ownerHouseNoMovePageFlow.indexOf(pageId);
                    previousPage = ownerHouseNoMovePageFlow[idx-1];

                    if ($scope.model.property.loan == "true") {
                        idx = ownerHouseNoMoveLoanPageFlow.indexOf(pageId);
                        previousPage = ownerHouseNoMoveLoanPageFlow[idx-1];

                        if ($scope.model.policyPaymentType == "dont_know") {
                            idx = ownerHouseNoMoveNoPolicyPageFlow.indexOf(pageId);
                            previousPage = ownerHouseNoMoveNoPolicyPageFlow[idx-1];
                        } else if ($scope.model.policyPaymentType != "") {
                            idx = ownerHouseNoMovePolicyPageFlow.indexOf(pageId);
                            previousPage = ownerHouseNoMovePolicyPageFlow[idx-1];
                        }
                    }

                    if ($scope.model.property.loan == "false") {
                        idx = ownerHouseNoMoveNoLoanPageFlow.indexOf(pageId);
                        previousPage = ownerHouseNoMoveNoLoanPageFlow[idx-1];
                    }
                }
                routeTo = pageFlow.get(previousPage);
            }

            if (previousPage == 'form-4') {
                hideRoommatesOption();
            }
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
            window.location.href = "#start/11";
        }
    }

    $scope.validatePropertyType = function() {
        if ($scope.model.property.type == "condo") {
            window.location.href = "#start/10";
        } else {
            window.location.href = "#start/8";
        }
        
    }

    $scope.validateBuildingType = function() {
        window.location.href = "#start/9";
    }

    $scope.validatePropertyUseType = function() {
        if ($scope.model.property.use == "move") {
            window.location.href = "#start/13";
        } else {
            window.location.href = "#start/10";
        }
    }

    $scope.validateActivePolicy = function() {
        window.location.href = "#final";

        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "house") {
                window.location.href = "#start/15";
            }
        }
    }

    $scope.validateSize = function() {
        var size = $scope.model.property.size;
        if (size < 10) {
            $scope.errorMessage = size + " parece ser improvável. Por favor tente novamente.";
            $(".error-message").show();
            return;
        }
        window.location.href = "#start/4";
        hideRoommatesOption();
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
            if ($scope.model.property.type == "house") {
                if ($scope.model.property.loan == "true") {
                    window.location.href = "#start/12";
                } else {
                    window.location.href = "#start/6";
                }
            }
        }
    }

    $scope.validatePaymentType = function() {
        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "condo") {
                if ($scope.model.property.loan == "true") {
                    if ($scope.model.policyPaymentType == "dont_know") {
                        window.location.href = "#start/14";
                    } else {
                        window.location.href = "#final";
                    }
                }
            }
            if ($scope.model.property.type == "house") {
                if ($scope.model.property.loan == "true") {
                    if ($scope.model.policyPaymentType == "dont_know") {
                        window.location.href = "#start/6";
                    } else {
                        window.location.href = "#start/15";
                    }
                }
            }
        }   
    }

    $scope.validateDebits = function() {
        window.location.href = "#start/16";
    }

    $scope.validateTimeToMove = function() {
        window.location.href = "#start/10";
    }

    $scope.validateCpf = function() {
        window.location.href = "#final";
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

    function hideRoommatesOption() {
        setTimeout(function() {
            $("#roommates-option").hide();
            var el = $("#roommates-option").parent();
            $(el).removeClass("col-xs-10 col-xs-offset-2");
            $(el).addClass("col-xs-6 col-xs-offset-3");
        }, 10);
    }

    // Evento no input text do Form 1
    $(document).on("input", function() {
        if ($(".error-message").is(":visible")) {
            $(".error-message").hide();
        }
    });

    // Evento no radio do Form 3
    $(document).on("change", "input[name='ownership']", function() {
        if ($("input[name='ownership']:checked").val()) {
            $scope.meetsRequirement = true;
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
        $(this).removeClass('x onX').val("");
        $('.container-map').hide();
        $(".error-message").hide();
    });
});
  

