$( document ).ready(async function() {
    setLoginLogoutUrl();
    const username = await cookieStore.get('username');
    if (username) showUsername(username);
});

function showUsername(username) {
    $('#logout-nav').show();
    $('#login-nav').hide();
}

function setLoginLogoutUrl() {
    const domain = 'https://login.goodhuman.in';
    const client_id = '6npcn6fde0tucr6npeq625optk';
    const scope = 'api%2Fall+aws.cognito.signin.user.admin+email+openid';
    $('#login-url').prop('href', `${domain}/oauth2/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=https%3A%2F%2Fthe.goodhuman.in%2F`);
    $('#logout-url').prop('href', `${domain}/logout?client_id=${client_id}&response_type=code&scope=${scope}&logout_uri=https%3A%2F%2Fthe.goodhuman.in%2Flogout.html`);
}
