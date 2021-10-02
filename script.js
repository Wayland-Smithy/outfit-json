var slot_list = [];

function regenJSON() {
  let drip = {
    outfit_type: '/datum/outfit',
    name: ($('#name').val() ? $('#name').val() : '')
  };

  for (const slot of slot_list) {
    if ($(`#${slot}`).val()) {
      drip[slot] = $(`#${slot}`).val()
    }
  }

  $('#code-out').val(JSON.stringify(drip, null, 2));
}

function apiRequest(type, path, params, callback) {
  let url = `https://api.github.com/${type}/${path}?${params}`;
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', url, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

$(function () {
  // highlight all text on click for easy copy
  $('#code-out').on('click', function () {
    $(this).select();
  });

  // generate slot names array from select ids
  $('.chosen-select').each(function () {
    slot_list.push($(this).attr('id'));
  })

  // outfit_options is populated by scripts included in the body before this one
  for (const slot of slot_list) {
    for (const option in outfit_options[slot]) {
      if (outfit_options[slot][option].indexOf('[]') !== -1)
        continue;
      $(`#${slot}`).append(`<option value="${option}">${outfit_options[slot][option]}</option>`);
    }
  }

  // set defaults
  $('#uniform').val('/obj/item/clothing/under/color/grey');

  // init the form selects and output
  $('.chosen-select').chosen({ allow_single_deselect: true });
  regenJSON();
  apiRequest('repos',
    'Wayland-Smithy/outfit-json/commits',
    'path=/outfit_options&per_page=1',
    (res) => {
      let data = JSON.parse(res);
      $('#update-time').text(dateFns.distanceInWordsToNow(data[0].commit.committer.date));
    });
});
