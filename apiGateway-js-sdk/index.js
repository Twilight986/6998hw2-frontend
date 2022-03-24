
var apigClient = apigClientFactory.newClient({
    apiKey: "N8408c4RVf3Wtp5SVk1CP7CmJKhIVebeY5svv1f0"
});
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition

function voiceSearch() {
    if ('SpeechRecognition' in window) {
        console.log("SpeechRecognition is Working");
    } else {
        console.log("SpeechRecognition is Not Working");
    }

    var inputSearchQuery = document.getElementById("search_query");
    const recognition = new window.SpeechRecognition();
    //recognition.continuous = true;

    micButton = document.getElementById("mic_search");

    if (micButton.innerHTML == "mic") {
        recognition.start();
    } else if (micButton.innerHTML == "mic_off") {
        recognition.stop();
    }

    recognition.addEventListener("start", function () {
        micButton.innerHTML = "mic_off";
        console.log("Recording.....");
    });

    recognition.addEventListener("end", function () {
        console.log("Stopping recording.");
        micButton.innerHTML = "mic";
    });

    recognition.addEventListener("result", resultOfSpeechRecognition);
    function resultOfSpeechRecognition(event) {
        console.log("I am in resultOfSpeechRecognition ")
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        inputSearchQuery.value = transcript;
        console.log("transcript : ", transcript)
    }
}




function textSearch() {
    var searchText = document.getElementById('search_query');
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        console.log('Searching Photos....');
        searchPhotos(searchText);
    }

}

function searchPhotos(searchText) {
    //var apigClient = apigClientFactory.newClient();
    console.log(searchText);
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";

    var params = {
        'q': searchText
    };
    console.log('params: ', params);
    apigClient.searchGet(params, {}, {})
        .then(function (result) {
            console.log("Result : ", result);

            //image_paths = result["data"]["body"]["imagePaths"];
            image_paths = result["data"];
            console.log("image_paths : ", image_paths);

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                images_list = image_paths[n].split('/');
                imageName = images_list[images_list.length - 1];

                photosDiv.innerHTML += '<figure><img src="' + image_paths[n] + '" style="width:25%"><figcaption>' + imageName + '</figcaption></figure>';
            }

        }).catch(function (result) {
            console.log(result);
        });
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // reader.onload = () => resolve(reader.result)
        reader.onload = () => {
            let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
            if ((encoded.length % 4) > 0) {
                encoded += '='.repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
        };
        reader.onerror = error => reject(error);
    });
}

function uploadPhoto() {

    // var file_data = $("#file_path").prop("files")[0];
    // var file = document.getElementById('file_path').files[0];
    // const reader = new FileReader();

    // var file_data;
    // var file = document.querySelector('#file_path > input[type="file"]').files[0];


    var filePath = (document.getElementById('uploaded_file').value).split("\\");
    var fileName = filePath[filePath.length - 1];

    if (!document.getElementById('custom_labels').innerText == "") {
        var customLabels = document.getElementById('custom_labels');
    }
    console.log(fileName);
    console.log(custom_labels.value);

    //var reader = new FileReader();
    var file = document.getElementById('uploaded_file').files[0];
    var file_type = file.type;
    //var body = data;
    var params = { "key": file.name, "bucket": "coms6998hw2b2", "Content-Type": file.type };
    var additionalParams = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*"
        }
    };
    console.log('apigClient',apigClient)
    // apigClient.uploadBucketKeyPut(params, body, additionalParams).then(function (res) {
    //     if (res.status == 200) {
    //         document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
    //         document.getElementById("uploadText").style.display = "block";
    //     }
    // })
    var config = {
        headers: { 'Content-Type': file_type, "X-Api-Key": "N8408c4RVf3Wtp5SVk1CP7CmJKhIVebeY5svv1f0", }
    };
    url = 'https://cors-anywhere.herokuapp.com/https://1ruo7vapab.execute-api.us-east-1.amazonaws.com/photoAPI2/upload/coms6998hw2b2/' + file.name
    //body = btoa(file);
    //file = btoa(file);
    axios.put(url, file, config).then(response => {
        // console.log(response.data)
        alert("Image uploaded successfully!");
    })
    // var encoded_image = getBase64(file).then(
    //     data => {
    //         console.log(data)
    //         //  var apigClient = apigClientFactory.newClient({
    //         //                    //apiKey: "QZyNutjpMiaCkLerrJ0Uj9ulUJ1siigx4zoRoL3x"
    //         //       });

    //         // var data = document.getElementById('file_path').value;
    //         // var x = data.split("\\")
    //         // var filename = x[x.length-1]
    //         //var file_type = file.type + ";base64"
    //         var file_type = file.type;
    //         var body = data;
    //         var params = { "key": file.name, "bucket": "coms6998hw2b2", "Content-Type": file.type };
    //         var additionalParams = {
    //             headers: {
    //                 "Access-Control-Allow-Origin": "*",
    //                 "Access-Control-Allow-Methods": "*",
    //                 "Access-Control-Allow-Headers": "*"
    //             }
    //         };
    //         console.log('apigClient',apigClient)
    //         // apigClient.uploadBucketKeyPut(params, body, additionalParams).then(function (res) {
    //         //     if (res.status == 200) {
    //         //         document.getElementById("uploadText").innerHTML = "Image Uploaded  !!!"
    //         //         document.getElementById("uploadText").style.display = "block";
    //         //     }
    //         // })
    //         var config = {
    //             headers: { 'Content-Type': file_type, "X-Api-Key": "N8408c4RVf3Wtp5SVk1CP7CmJKhIVebeY5svv1f0", }
    //         };
    //         url = 'https://cors-anywhere.herokuapp.com/https://1ruo7vapab.execute-api.us-east-1.amazonaws.com/photoAPI2/upload/coms6998hw2b2/' + file.name
    //         axios.put(url, file, config).then(response => {
    //             // console.log(response.data)
    //             alert("Image uploaded successfully!");
    //         })
    //     });
    // //var apigClient = apigClientFactory.newClient();
    // var filePath = (document.getElementById('uploaded_file').value).split("\\");
    // var fileName = filePath[filePath.length - 1];

    // if (!document.getElementById('custom_labels').innerText == "") {
    //     var customLabels = document.getElementById('custom_labels');
    // }
    // console.log(fileName);
    // console.log(custom_labels.value);

    // var reader = new FileReader();
    // var file = document.getElementById('uploaded_file').files[0];
    // console.log('File : ', file);
    // document.getElementById('uploaded_file').value = "";

    // if ((filePath == "") || (!['png', 'jpg', 'jpeg'].includes(filePath.toString().split(".")[1]))) {
    //     alert("Please upload a valid .png/.jpg/.jpeg file!");
    // } else {

    //     var params = { "key": file.name, "bucket": "coms6998hw2b2", "Content-Type": file.type };
    //     var additionalParams = {
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Access-Control-Allow-Methods": "*",
    //             "Access-Control-Allow-Headers": "*"
    //         }
    //     };
    // var additionalParams = {
    // };
    // apigClient.uploadBucketKeyPut(params, body, additionalParams).then(function (result) {
    //     console.log('result: ', result);
    // }).catch(function (error) {
    //     console.log('error: ', error);
    // })
    // reader.onload = function (event) {
    //     body = btoa(event.target.result);
    //     console.log('Reader body : ', body);
    //     //return apigClient.folderItemPut(params, additionalParams)
    //     return apigClient.uploadBucketKeyPut(params, body, additionalParams).then(function (result) {
    //         console.log('result: ', result);
    //     }).catch(function (error) {
    //             console.log('error: ', error);
    //         })
    // }
    // reader.readAsBinaryString(file);
//}
}