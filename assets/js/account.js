$( document ).ready(async function() {
    const token = typeof cookieStore !== 'undefined' ? await cookieStore.get('access_token') : $.cookie('access_token');
    if(token) getAccount(token.value || token);
    else window.location.href = $('#login-url').prop('href');
});

async function getAccount(token) {
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
      });

}
