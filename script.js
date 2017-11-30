var app = angular.module('PokedexApp', ['ngMaterial', 'angularUtils.directives.dirPagination']);

app.controller('PokedexCtrl', ['$scope', '$mdSidenav','$http', function($scope, $mdSidenav,$http){
  $scope.pokemonList;
  $scope.pokemonNow = '';
  
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  
  function getList(){
    $http.get('http://pokeapi.co/api/v1/pokedex/1/').success(function(pokemons){
      if (pokemons){
        console.log(pokemons);
        $scope.pokemonList = pokemons.pokemon.sort(function(a,b){
          if (a.name < b.name){return -1}
          if (a.name > b.name){return 1}
        });
        $scope.pokemonNow = '';
      }
    });
  }
  getList();
  
  $scope.getPokemonList = function(){
    getList()
  };
  
  $scope.getPokemonDetail = function(uri){
    $http.get('http://pokeapi.co/'+uri).success(function(pokemon){
      if ($scope.pokemonNow==false) $scope.pokemonNow=true;
      else if ($scope.pokemonNow == true) $scope.pokemonNow=false;
      {
        $scope.pokemonNow = false;
        getImgUri(pokemon.sprites[0].resource_uri);
      }
    });
  }
  
  var getImgUri = function(uri){
    $http.get('http://pokeapi.co/'+uri).success(function(image){
      if (image){
        $scope.pokemonNow.sprite = 'http://pokeapi.co' + image.image;
      }
    });
  }
 
}]);



app.filter('startFrom', function () {
  return function (input, start) {
    if (input) {
      start = +start;
      return input.slice(start);
    }
    return [];
  };
});

app.controller('PageCtrl', ['$scope', 'filterFilter', function ($scope, filterFilter) {
  
  // create empty search model (object) to trigger $watch on update
  $scope.search = {};

  $scope.resetFilters = function () {
    // needs to be a function or it won't trigger a $watch
    $scope.search = {};
  };

  // pagination controls
  $scope.currentPage = 1;
  $scope.totalItems = 700;
  $scope.entryLimit = 7; // items per page
  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

  // $watch search to update pagination
  $scope.$watch('search', function (newVal, oldVal) {
    $scope.filtered = 20;
    $scope.totalItems = $scope.filtered.length;
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $scope.currentPage = 1;
  }, true);
}]);

