const noDataCard = `
<div class="card mb-2" style="width: 100%;">
    <div class="card-body">
        <p class="card-text">No data as of now, feature coming soon!</p>
    </div>
</div>
`;
async function getData(profile) {

    const url = `https://the-good-human.s3.ap-south-1.amazonaws.com/profiles/${profile}.json`;
    const res = await fetch(url);
    if (res.status === 403) window.location.href = "/error.html";
    const data = await res.json();
    // name
    document.getElementById('data_name').innerHTML = data.name;
    // externalLinks
    const externalLinks = data.externalLinks|| [];
    const externalLinksData = externalLinks.filter(item => item.published).map(item => {
        return `<a target="_blank" href="${item.url}">${item.platform}</a>`;
    });
    document.getElementById('data_externalLinks').innerHTML = externalLinksData.join('<br/>');
    // skills
    const skills = data.skills|| [];
    const skillsData = skills.map(item => {
        return `<li>${item}</li>`;
    });
    document.getElementById('data_skills').innerHTML = skillsData.join('');
    // traits
    const traits = data.traits|| [];
    const traitsData = traits.map(item => {
        return `<li>${item}</li>`;
    });
    document.getElementById('data_traits').innerHTML = traitsData.join('');
    // testimonials
    const testimonials = data.testimonials|| [];
    const testimonialsData = testimonials.filter(item => item.published).map(item => {
        return `<div class="card mb-2" style="width: 100%;">
            <div class="card-body">
                <p class="card-text">${item.text}</p>
                <p class="card-link text-end">
                ${item.author}
                <br/>
                <i style="color: gray;">${item.relation}</i>
                </p>
            </div>
        </div>`;
    });
    document.getElementById('data_testimonials').innerHTML = testimonialsData.join('') || noDataCard;
    // endorsements
    const endorsements = data.endorsements|| [];
    const endorsementsData = endorsements.filter(item => item.published).map(item => {
        return `<div class="card mb-2" style="width: 100%;">
            <div class="card-body">
                <p class="card-text">${item.text}</p>
                <p class="card-link text-end">
                ${item.author}
                <br/>
                <i style="color: gray;">${item.relation}</i>
                </p>
            </div>
        </div>`;
    });
    document.getElementById('data_endorsements').innerHTML = endorsementsData.join('') || noDataCard;
}
const pathname = this.location.pathname.split('/');
if (pathname.length != 2) {
    window.location.href = "/";
}
const profile = pathname.pop();
getData(profile);
