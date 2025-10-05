const token = $.cookie('access_token');
$('#counter-form').hide();

$( document ).ready(async function() {
    document.getElementById('incrementBtn').addEventListener('click', function() {
      var input = document.getElementById('increment');
      input.value = Number(input.value) + 1;
    });
    
    if(token || true) getCounter();
    else window.location.href = $('#login-url').prop('href');
});

async function getCounter() {
    $('#counter-form').show();
    const settings = {
        "url": "https://api.goodhuman.in/counter",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": `Bearer ${token}`,
          "Access-Control-Allow-Origin": window.location.origin
        },
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
}

async function putCounter() {
  $('#saveCounterBtn').prop('disabled', true)
  const settings = {
      "url": "https://api.goodhuman.in/counter",
      "method": "PUT",
      "timeout": 0,
      "headers": {
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": window.location.origin
      },
      "data": JSON.stringify({ name: $('#incrementBy').val() })
    };
    
    $.ajax(settings).done(function (response) {
      $('#saveCounterBtn').prop('disabled', false);
      getCounter();
    });
}

