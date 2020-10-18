// Working with main.html file in public folder
$(document).ready(function () {
  // WHEN SEARCH BUTTON IS CLICKED FROM THE SEARCH INPUT BOX...
  $("#searchBtn").on("click", function () {
    event.preventDefault();
    // THE SEARCH INPUT BOX DISAPPEARS...
    $('.searchBox').hide();
    // THE ANIMAL INFO BOX APPEARS.
    $('.animalBox').show();
    $('.searchAgain').show();

    // GETTING ALL INPUT VALUES & SETTING THEM AS VARIABLES TO BE USED TO MAKE PETFINDER API CALL
    const zipcode = $("#zipCode").val().trim();
    const animalType = $('input[name="petType"]:checked').val();
    const gender = $('input[name="gender"]:checked').val();
    const age = $("#selectAge option:selected").val();
    const size = $("#selectSize option:selected").val();

    // CONSOLE.LOG TO CHECK VALUES CHOSEN IS CORRECT
    // console.log(zipcode, animalType, gender, age, size);

    $.ajax({
      url: '/api/search',
      method: 'POST',
      data: {
        zipcode: zipcode,
        animalType: animalType,
        gender: gender,
        age: age,
        size: size
      }
    }).then(function (data) {
      // DATA OUTPUT IS THE RESULT OF PETS COMING OUT OF SEARCH PARAMETERS SET FORTH ABOVE
      // console.log(data);

      for (var i = 0; i < data.length; i++) {
        var petIMGurl = "";
        if (data[i].primary_photo_cropped === null) {
          petIMGurl = 'https://via.placeholder.com/150/008ae6/FFF/?text=No+Photo+Available';
        } else {
          petIMGurl = data[i].primary_photo_cropped.small;
        }
        var petName = data[i].name;
        var petStatus = data[i].status;
        var petDistance = parseInt(data[i].distance);
        var newPetDistance = petDistance.toFixed(1);
        var petGender = data[i].gender;
        var petBreed = data[i].breeds.primary;
        var petMixed = data[i].breeds.mixed;
        var petWebLink = data[i].url;
        var petAge = data[i].age;
        var petSize = data[i].size;

        var petMix = "";
        if (petMixed === true) {
          petMix = "Yes";
        } else if (petMixed === false) {
          petMix = "Nope";
        } else { petMix = "Not sure" }

        var newPetCard = $(`<div class='card pet-card h-100' id='pet-card-${[i]}'>`);
        var newPetPic = $(`<img class='card-img-top img-thumbnail rounded mx-auto d-block' id='pet-pic-${[i]}'>`);
        newPetPic.attr("src", petIMGurl);

        var newPetCardBody = $(`<div class='card-body pet-${[i]} pet-card-body'>`);

        newPetCardBody.append(`
        <h5 class="card-title">Hello! I'm ${petName}</h5>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Status: ${petStatus}</li>
        <li class="list-group-item">Distance: ${newPetDistance} miles away</li>
        <li class="list-group-item">Gender: ${petGender}</li>
        <li class="list-group-item">Breed: ${petBreed}</li>
        <li class="list-group-item">Mixed Breed? ${petMix}</li>
      </ul>
      <div class="card-body m-auto">
        <a href="${petWebLink}" class="card-link"><button type="button" class="btn btn-outline-warning btn-sm">ADOPT INFO!</button></a>
        <button type="button" class="btn btn-outline-danger btn-sm" data-name="${petName}" data-age="${petAge}" data-gender="${petGender}" data-breed="${petBreed}" data-size="${petSize}" data-url="${petWebLink}" data-img="${petIMGurl}">&hearts;</button>
      </div>
        `);

        newPetCard.append(newPetPic);
        newPetCard.append(newPetCardBody);
        $(".animalBox").append(newPetCard);
      }// === END FOR LOOP OF CREATING NEW DIVS FOR EACH PET RESULT

    });
  }) //==== END OF BUTTON CLICK OF SEARCH FUNCTION

  $(document).on("click", ".btn-outline-danger", function (event) {
    event.preventDefault();

    var favAnimal = {
      name: $(this).attr("data-name"),
      gender: $(this).attr("data-gender"),
      breed: $(this).attr("data-breed"),
      age: $(this).attr("data-age"),
      size: $(this).attr("data-size"),
      img: $(this).attr("data-img"),
      url: $(this).attr("data-url"),
      notes: $(this).attr("data-notes")
    }
    $.ajax({
      url: "/api/favorites/",
      type: "POST",
      data: favAnimal
    }).then(function (data) {
      console.log(data)
    })
  })

}); //==== END DOCUMENT.READY

