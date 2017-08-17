;(async function (param) { 
    var res = await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve("yes : 11111");
        }, 3000);
    });
    console.log("3s -->", res);
})();
