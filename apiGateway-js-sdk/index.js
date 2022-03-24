
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
            if (image_paths == 'No such photos.') {
                alert('No result found!');
            } else {
                var photosDiv = document.getElementById("photos_search_results");
                photosDiv.innerHTML = "";
                for (n = 0; n < image_paths.length; n++) {
                    images_list = image_paths[n].split('/');
                    imageName = images_list[images_list.length - 1];

                    photosDiv.innerHTML += '<figure><img src="' + image_paths[n] + '" style="width:25%"><figcaption>' + imageName + '</figcaption></figure>';
                }
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



    var filePath = (document.getElementById('uploaded_file').value).split("\\");
    var fileName = filePath[filePath.length - 1];
    var customLabels = "*";
    console.log('customLabels: ', customLabels);
    console.log('value ', document.getElementById('custom_labels').value);


    if (document.getElementById('custom_labels').value != "") {
        customLabels = document.getElementById('custom_labels').value;
        console.log('customLabels: ', customLabels);
    }

    var file = document.getElementById('uploaded_file').files[0];
    var file_type = file.type+";base64";
    var data = document.getElementById('uploaded_file').value;
    var encoded = getBase64(file);
    var params = { "filename": file.name, "bucket": "coms6998hw2b2", "Content-Type": file_type, 'x-amz-meta-customLabels': customLabels,'Access-Control-Allow-Origin':'*'};
    var additionalParams = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': file_type
        }
    };
    console.log('file: ', file);


    var encoded_image = getBase64(file).then(
        data => {
            console.log(data)
            var body = data;
            apigClient.uploadBucketFilenamePut(params, body, additionalParams).then(function (res) {
                if (res.status == 200) {
                    alert('Image Uploaded  !!!');
                }
            })
        });

}