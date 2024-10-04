const qs = location.href.split('?')[1] || null
const code = qs?.split('&').filter((v) => v.split('=')[0] === 'code')[0].split('=')[1]

if (code) {
    login(code);
}

function login(code) {

    const login = {
        "url": "https://login.goodhuman.in/oauth2/token",
        "method": "POST",
        "timeout": 0,
        "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic Nm5wY242ZmRlMHR1Y3I2bnBlcTYyNW9wdGs6MTBlZDgyYWR2YmRjcmMwZHU3cHUycG9ncmE5ZjlpNzhwbWFpMmoyaTNrZ2NlZ3NlNzZ1bw==",
        },
        "data": {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "https://the.goodhuman.in/"
        }
    };
    
    $.ajax(login).done(function (response) {
        cookieStore.set({
            name: "access_token",
            value: response.access_token,
            expires: Date.now() + (1000*60*60*24),
            domain: "goodhuman.in",
        });
        
        cookieStore.set({
            name: "refresh_token",
            value: response.refresh_token,
            expires: Date.now() + (1000*60*60*24),
            domain: "goodhuman.in",
        });

        setUserName();

    });

}

function setUserName() {
    var settings = {
        "url": "https://api.goodhuman.in/me",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": 'Bearer ' + cookieStore.get('access_token')
        },
      };
      
      $.ajax(settings).done(function (response) {
        cookieStore.set({
            name: "username",
            value: response.filter(v => v.Name==='email')[0].Value,
            expires: Date.now() + (1000*60*60*24),
            domain: "goodhuman.in",
        });
      });
}
