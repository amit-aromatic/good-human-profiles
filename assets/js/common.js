$( document ).ready(async function() {
    const username = await cookieStore.get('username');
    if (username) showUsername(username);
});

function showUsername(username) {
    $('#logout-nav').show();
    $('#login-nav').hide();
}