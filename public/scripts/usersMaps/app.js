const allMaps = [];
let currentMapEditId = null;
let currentMapElement = null;

const $mapContainer = $('#mapContainer');
const $editMapPopUpContainer = $('#pop-up-background-edit-map');
const $addMapPopUpContainer = $('#pop-up-background-add-map');
const $updateMapForm = $('#updateMapForm');
const $addMapForm = $('#addMapForm');
const $addMapBtn = $('#addMapBtn');

$addMapBtn.on('click', e => $addMapPopUpContainer.toggleClass('displayFlex'));


$addMapPopUpContainer.on('click', e => {
  if(e.target !== $addMapPopUpContainer[0]) return;
  currentMapEditId = null;
  currentMapElement = null;
  $addMapPopUpContainer.toggleClass('displayFlex');
})

$editMapPopUpContainer.on('click', e => {
  if(e.target !== $editMapPopUpContainer[0]) return;
  currentMapEditId = null;
  currentMapElement = null;
  $editMapPopUpContainer.toggleClass('displayFlex');
})

$addMapForm.submit(function(e) {
  e.preventDefault();
  const inputs = $(this).serializeArray();
  let values = {}

  for (const i in inputs) {
    const key = inputs[i].name;
    const value = inputs[i].value;
    values[key] = value;
  }

  $.ajax({
    method: "POST",
    url: `/api/maps`,
    data: values
  })
  .done(function( content ) {
    allMaps.push(content);
    renderMaps();
    $addMapPopUpContainer.toggleClass('displayFlex');
  });


})

$updateMapForm.submit(function(e) {
  e.preventDefault();
  const inputs = $(this).serializeArray();
  let values = {}

  for (const i in inputs) {
    const key = inputs[i].name;
    const value = inputs[i].value;
    values[key] = value;
  }

  $.ajax({
    method: "PATCH",
    url: `/api/maps/${currentMapEditId}`,
    data: values
  })
  .done(function( content ) {
    console.log(currentMapElement);
    currentMapElement.html(`
      <section>
        <img alt='cover image for place collection' src='${values.cover_img}'/>
        <content>
          <header>
            <h2>${values.title}</h2>
            <h4>${values.city}</h4>
          </header>
          <p>${values.description}</p>
        </content>
        <button>Edit</button>
      </section>

      <aside>
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </aside>
  `);
  })


})

let ajaxUrl = `/api/users/${userId}/maps`;

$.ajax({
  method: "GET",
  url: ajaxUrl
})
.done(function( content ) {
  content.forEach(element => {
    allMaps.push(element);
  });
  renderMaps();
})

function renderMaps(howManyToShowPerRender = 10) {
  for (let i = 0; i < howManyToShowPerRender; i++) {
    if (!allMaps.length) return;
    renderMapToScreen(allMaps.shift());
  }
}

// title:
// city:
// cover_img:
// description:

// id:
// owner_id:
// public:

function renderMapToScreen(mapData) {
  const $element = $(`
    <article>
      <section>
        <img alt='cover image for place collection' src='${mapData.cover_img}'/>
        <content>
          <header>
            <h2>${mapData.title}</h2>
            <h4>${mapData.city}</h4>
          </header>
          <p>${mapData.description}</p>
        </content>
        <button>Edit</button>
      </section>

      <aside>
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      </aside>

    </article>
  `);


  // Navigated to map page
  $element.on('click','content', e => {
    window.location.assign("/maps/"+mapData.id);
  })

  // Show Edit Buttons
  $element.on('click','section button', e => {
    $element.find('aside').toggle('fast');
  })

  // Edit Map Button
  $element.on('click','aside .editBtn', e => {
    updateEditPopup(mapData);
    currentMapElement = $element;
    $editMapPopUpContainer.toggleClass('displayFlex');
  })

  // Delete Button
  $element.on('click','aside .deleteBtn', e => {
    $.ajax({
      method: "DELETE",
      url: `/api/maps/${mapData.id}`,
      data: {owner_id: userId}
    })
    .done(function() {
      $element.remove();
    })
  })

  $mapContainer.append($element);
}

function updateEditPopup(mapData) {
  const formInputs = $editMapPopUpContainer.find('form input')
  currentMapEditId = mapData.id;

  formInputs.each(function() {
    switch(this.id) {
      case 'title':
        $(this).val(mapData.title)
        break;
      case 'city':
        $(this).val(mapData.city)
        break;
      case 'description':
        $(this).val(mapData.description)
        break;
      case 'cover_img':
        $(this).val(mapData.cover_img)
        break;
    }
  })
}

$('#loadMoar').on('click', e => {
  renderMaps();
})