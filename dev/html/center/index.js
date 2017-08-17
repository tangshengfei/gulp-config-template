;(async function (param) { 
    var res = await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve("center : 11111");
        }, 3000);
    });
    console.log("5s -->", res);
})();
