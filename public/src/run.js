angular.module('project').config(function($stateProvider){
    var first = {
        name: 'first',
        url: '/firstpage',
        templateUrl: './views/first.html'
    };

    var second = {
        name : 'second',
        url: '/secondpage',
        templateUrl: './views/second.html'
    };
    $stateProvider.state({
        name: '/',
        url: ''
    });
    $stateProvider.state(first);
    $stateProvider.state(second);
}).controller('mainctrl', function($state, $rootScope){
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
        console.log('-----------------------------------Start-----------------------------------');
            console.log('state current is : %o', $state.current.name);
            console.log('from : %o to %o', fromState.name, toState.name);
            console.log('state current is : %o', $state.current.name);
            console.log('-----------------------------------Start-----------------------------------');
    });
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
            console.log('-----------------------------------Success-----------------------------------');
            console.log('state current is : %o', $state.current.name);
            console.log('from : %o to %o', fromState.name, toState.name);
            console.log('state current is : %o', $state.current.name);
            console.log('-----------------------------------Success-----------------------------------');
        });
});