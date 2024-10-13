$( document ).ready(async function() {
    const token = await cookieStore.get('access_token');
    if(token) getAccount(token.value);
    else window.location.href = $('#login-url').prop('href');
});

async function getAccount(token) {
    const settings = {
        "url": "https://api.goodhuman.in/me",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": `Bearer ${token}`
        },
      };
      
      $.ajax(settings).done(function (response) {
        const username = response.filter(v => v.Name==='email')[0].Value;
        const name = response.filter(v => v.Name==='name')[0]?.Value;
        const birthday = response.filter(v => v.Name==='birthday')[0]?.Value;
      });

}
