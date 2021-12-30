function getPredition(input){
    //console.log(input);
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: '/get_pred_data',
                type: 'POST',
                datatype: 'JSON',
                data: {data:JSON.stringify(input)},
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
        });
    });
}


