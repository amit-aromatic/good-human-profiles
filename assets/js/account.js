const token = $.cookie('access_token');

$( document ).ready(async function() {
    if(token) getAccount();
    else window.location.href = $('#login-url').prop('href');
});

async function getAccount() {
    const settings = {
        "url": "https://api.goodhuman.in/me",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": `Bearer ${token}`,
          "Access-Control-Allow-Origin": window.location.origin
        },
      };
      
      $.ajax(settings).done(function (response) {
        const username = response.filter(v => v.Name==='email')[0].Value;
        const name = response.filter(v => v.Name==='name')[0]?.Value;
        const birthday = response.filter(v => v.Name==='birthday')[0]?.Value;
        $('#inputEmail').val(username);
        $('#inputName').val(name);
      });
}

async function putAccount() {
  const settings = {
      "url": "https://api.goodhuman.in/me",
      "method": "PUT",
      "timeout": 0,
      "headers": {
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": window.location.origin
      },
      "data": JSON.stringify({ name: $('#inputName').val() })
    };
    
    $.ajax(settings).done(function (response) {
      console.log({ response })
      getAccount();
    });
}
