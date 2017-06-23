app.factory('DataHolderModel', function() {
    var model = {};
    var default_model = {
        userName: '',
        userSurname: '',
        cpf: '',
        email: '',
        birth_day: '',
        birth_month: '',
        birth_year: '',
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
        map: {
            place: null,
            infowindow: null,
            marker: null,
            map: null,
            address: null,
            isInitialized: false
        },
        ownership: '', // rent/own
        optionals: {
            roommates: false,
            fire_alarm: false,
            burglar_alarm: false
        } ,
        valuables: '',
        activePolicy: '',
        policyPaymentType: '', // mortgage/none/insurer/dont_know
        property: {
            type: '', // condo/house
            buildingType: '', // studio/duplex/triplex
            use: '',
            size: '',
            loan: ''
        },
        moveInDate: '',
        debits: '', // nope/one/more
        agreedToTerms: false,

        resetData : function() {
            return model = angular.copy(default_model, model);
        }
    };
    default_model.resetData();

    var contactUs = {};
    var contactUs_default = {
        name: '',
        email: '',
        message: '',
        resetData: function() {
            return contactUs = angular.copy(contactUs_default, contactUs);
        }
    }
    contactUs_default.resetData();

    var ratings = {};
    var ratings_default = {
        ratingsMessage: 'Conectando às bases de dados...',
        loadingValue: 10,
        hideRate1: true,
        hideRate2: true,
        hideRate3: true,
        hideRate4: true,
        hideRate5: true,
        flagIsLastPage: false,
        resetData: function() {
            return ratings = angular.copy(ratings_default, ratings);
        }
    }
    ratings_default.resetData();

    var DataHolderModel = {
        model,
        contactUs,
        ratings
    };

    return DataHolderModel;
});

app.factory('UtilityFactory', function() {
    var util = {};
    var util_default = {
        keepBubbleMessage: false,
        infoMessage: '',

        reset: function() {
            return util = angular.copy(util_default, util);
        }
    };
    util_default.reset();

    return util;
});

/*app.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    $mdDateLocaleProvider.shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    $mdDateLocaleProvider.days = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
    $mdDateLocaleProvider.shortDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom' ];
});*/

app.controller('appController', function($scope, $location, $route, $interval, $timeout, $mdSidenav, DataHolderModel, UtilityFactory) {

    /*
        Controles de exibição de páginas em comum
    */
    $scope.contactModel = DataHolderModel.contactUs;
    $scope.model = DataHolderModel.model;
    $scope.errorMessage = "";
    $scope.infoMessage = "";

    /*
        Controle de exibição da últma página (r#esult)
    */
    $scope.isLastPage = DataHolderModel.ratings.flagIsLastPage;
    $scope.clientType = $scope.model.ownership == "renter" ? "Inquilinos" : "Proprietários";
    $scope.clientAddress = $scope.model.userAddress.formatted_address;
    

    /*
        Controles de exibição de Rating
    */
    $scope.ratingsMessage = DataHolderModel.ratings.ratingsMessage;
    $scope.loadingValue = DataHolderModel.ratings.loadingValue;
    
    // Variáveis de controle de exibição de ratings (página #process)
    $scope.hideRate1 = DataHolderModel.ratings.hideRate1;
    $scope.hideRate2 = DataHolderModel.ratings.hideRate2;
    $scope.hideRate3 = DataHolderModel.ratings.hideRate3;
    $scope.hideRate4 = DataHolderModel.ratings.hideRate4;
    $scope.hideRate5 = DataHolderModel.ratings.hideRate5;

    $scope.showRatings = function() {
        DataHolderModel.ratings.resetData();

        $location.url('/process');

        var i = 1;
        $interval(function() {

            DataHolderModel.ratings.loadingValue += 18;

            if (i == 1) {
                DataHolderModel.ratings.hideRate1 = false;
            } else if (i == 2) {
                DataHolderModel.ratings.hideRate2 = false;
            } else if (i == 3) {
                DataHolderModel.ratings.hideRate3 = false;
            } else if (i == 4) {
                DataHolderModel.ratings.hideRate4 = false;
            } else if (i == 5) {
                DataHolderModel.ratings.hideRate5 = false;
                DataHolderModel.ratings.ratingsMessage = "Análise concluída";
            } 
            if (i > 6) {
                var routeTo = '/result';
                $location.url(routeTo);
                DataHolderModel.ratings.flagIsLastPage = true;
            }
            i++;

            $route.reload();
        }, 750, 7, true);
    }

    $scope.goBackwards = function() {
        var pageId = $("section > .container-fluid").attr("id");

        var previousPage = null;
        var routeTo = null;
        var idx = null;
        if ($scope.model.ownership == "renter") {
            idx = renterPageFlow.indexOf(pageId);
            previousPage = renterPageFlow[idx-1];
            routeTo = pageFlow.get(previousPage);
            $location.url(routeTo);

        } else if ($scope.model.ownership == "owner") {
            routeTo = '/start/3';

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
            $location.url(routeTo);
        } else {
            /* 
                Common routes
            */
            switch(pageId) {
                case 'form-2':
                    $location.url('/start/1');
                    break;
                case 'form-3':
                    $location.url('/start/2');
                    break;
                case 'process':
                    $location.url('/final');
                    break;
                default:
                    $location.url('/start/1');
            }
        }

         if (UtilityFactory.keepBubbleMessage) {
            setTimeout(function() {
                $("#info-bubble-row").show();
                $scope.infoMessage = UtilityFactory.infoMessage;
            }, 1000);
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
            $location.url('/start/2');
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
                $location.url('/start/3');
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
                $location.url('/start/4');
                $("#roommates-option").show();
            } else {
                $location.url('/start/7');
            }
        }
    }

    $scope.validateOptionals = function() {
        $location.url('/start/5');
    }

    $scope.validateValuables = function() {
        if ($scope.model.ownership == "renter") {
            $location.url('/start/6');
        }

        if ($scope.model.ownership == "owner") {
            $location.url('/start/11');
        }
    }

    $scope.validatePropertyType = function() {
        if ($scope.model.property.type == "condo") {
            $location.url('/start/10');
        } else {
            $location.url('/start/8');
        }
    }

    $scope.validateBuildingType = function() {
        $location.url('/start/9');
    }

    $scope.validatePropertyUseType = function() {
        if ($scope.model.property.use == "move") {
            $location.url('/start/13');
        } else {
            $location.url('/start/10');
        }
    }

    $scope.validateActivePolicy = function() {
        $location.url('/final');

        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "house") {
                $location.url('/start/15');
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
        $location.url('/start/4');
        hideRoommatesOption();
    }

    $scope.validateLoan = function() {
        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "condo") {
                if ($scope.model.property.loan == "true") {
                    $location.url('/start/12');
                } else {
                    $location.url('/start/14');
                }
            }
            if ($scope.model.property.type == "house") {
                if ($scope.model.property.loan == "true") {
                    $location.url('/start/12');
                } else {
                    $location.url('/start/6');
                }
            }
        }
    }

    $scope.validatePaymentType = function() {
        if ($scope.model.ownership == "owner") {
            if ($scope.model.property.type == "condo") {
                if ($scope.model.property.loan == "true") {
                    if ($scope.model.policyPaymentType == "dont_know") {
                        $location.url('/start/14');
                    } else {
                        $location.url('/final');
                    }
                }
            }
            if ($scope.model.property.type == "house") {
                if ($scope.model.property.loan == "true") {
                    if ($scope.model.policyPaymentType == "dont_know") {
                        $location.url('/start/6');
                    } else {
                        $location.url('/start/15');
                    }
                }
            }
        }   
    }

    $scope.validateDebits = function() {
        $location.url('/start/16');
    }

    $scope.validateTimeToMove = function() {
        $location.url('/start/10');
    }

    $scope.validateCpf = function() {
        $location.url('/final');
    }

    /*
        :::::::::::::  Change Controls :::::::::::::
    */

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
            UtilityFactory.infoMessage = "OK. Vou te mostrar como adicioná-los a sua apólice em alguns passos";
            $scope.infoMessage = UtilityFactory.infoMessage;
            $("#info-bubble-row").show();
            UtilityFactory.keepBubbleMessage = true;
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

    $scope.policyPaymentChange = function() {
        var type = $scope.model.policyPaymentType;
        
        $scope.infoMessage = "";
        $("#info-bubble-row").hide();

        if (type == "mortgage") {
            $scope.infoMessage = "Nós iremos realizar a cobrança em seu cartão apenas no primeiro mês e então os próximos pagamentos serão realizados diretamente com seu financiador";
            $("#info-bubble-row").show();
        } else if (type == "none") {
            $scope.infoMessage = "Assim que você obter nosso seguro, cuidaremos para que seu financiador saiba dos detalhes";
            $("#info-bubble-row").show();
        } else if (type == "insurer") {
            $scope.infoMessage = "Caso você obtenha nosso seguro, nós cuidaremos dos detalhes da troca de apólice de seguro e notificaremos seu antigo segurador." +
                "Também cuidaremos para que você obtenha reembolso, se aplicável!";
            $("#info-bubble-row").show();
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

    $scope.toggleLeftMenu = function() {
        $mdSidenav("left").toggle();
    }

    $scope.clearContactForm = function() {
        DataHolderModel.contactUs.resetData();
    }

    $scope.restart = function() {
        DataHolderModel.model.resetData();
        $scope.start();
    }

    $scope.start = function() {
        $location.url('/start/1');
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

    angular.element(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

});

app.controller('mapController', function($scope, DataHolderModel) {

    $scope.model = DataHolderModel.model;
    $scope.user = $scope.model.userName;
    $scope.mapModel = $scope.model.map;
    $scope.errorMessage = "";

    if (!$scope.mapModel.isInitialized) {
        $('.container-map').hide();
    }

    angular.element(document).ready(function () {
        initMap();
    });

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'));
        var input = document.getElementById('locationInput');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var marker, infowindow, place, address;

        if ($scope.mapModel.isInitialized) {
            place = $scope.mapModel.place;

            map.setCenter(place.geometry.location);
            map.setZoom(17);

            address = $scope.mapModel.address;

            marker = defineMarker(map, place);
            infowindow = defineInfoWindow(map, marker, place, address);
        }

        autocomplete.addListener('place_changed', function() {
            place = autocomplete.getPlace();

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
                
                if (place.address_components.length < 7) {
                    $scope.errorMessage = "O endereço informado deve conter informações de número e bairro";
                    $(".error-message").show();
                    $("#locationInput").val('');

                    $scope.$apply();
                    return;

                } else {
                    $('.container-map').show();
                    $(".error-message").hide();
                    
                    google.maps.event.trigger(map, 'resize');

                    // If the place has a geometry, then present it on a map.
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);

                    $scope.model.userAddress.logradouro = place.address_components[0].long_name;
                    $scope.model.userAddress.numero = place.address_components[1].long_name;
                    $scope.model.userAddress.bairro = place.address_components[2].long_name;
                    $scope.model.userAddress.cidade = place.address_components[3].long_name;
                    $scope.model.userAddress.estado = place.address_components[4].short_name;
                    $scope.model.userAddress.pais = place.address_components[5].long_name;
                    $scope.model.userAddress.cep = place.address_components[6].long_name;
                    $scope.model.userAddress.isValid = true;

                    if (place.address_components) {
                        address = [
                          (place.address_components[0] && place.address_components[0].short_name || ''),
                          (place.address_components[1] && place.address_components[1].short_name || ''),
                          (place.address_components[2] && place.address_components[2].short_name || '')
                        ].join(' ');
                    }
                    $scope.mapModel.address = address;
                }
            }
            $scope.mapModel.isInitialized = true;
            marker = defineMarker(map, place);
            infowindow = defineInfoWindow(map, marker, place, address);

            $scope.mapModel.infowindow = infowindow;
            $scope.mapModel.marker = marker;
            $scope.mapModel.place = place;
            $scope.mapModel.map = map;
        });
    }

    function defineMarker(map, place) {
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -20)
        });

        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        return marker;
    }

    function defineInfoWindow(map, marker, place, address) {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
        return infowindow;
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
        $(this).removeClass('x onX');
        $(this).val("");
        $('.container-map').hide();
        $(".error-message").hide();
        // Update model
        $scope.model.userAddress.formatted_address = "";
    });
});
  

