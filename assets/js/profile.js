const pathname = this.location.pathname.split('/');
if (pathname.length > 2 && pathname[2].length) {
    window.location.href = "/";
}
const profile = pathname[1];
getData(profile);

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
    $('#data_name').html(data.name);

    // externalLinks
    const externalLinks = data.externalLinks || [];
    if (!externalLinks.length) $("#data_externalLinks").hide();
    const externalLinksData = externalLinks.filter(item => item.published)
        .map(item => `<a target="_blank" href="${item.url}">${item.platform}</a>` );
    $('#data_externalLinks').html(externalLinksData.join('<br/>'));

    // skills
    const skills = data.skills|| [];
    if (!skills.length) $("#skills-wrap").hide();
    const skillsData = skills.map(item => `<li>${item}</li>`);
    $('#data_skills').html(skillsData.join(''));

    // traits
    const traits = data.traits|| [];
    if (!traits.length) $("#traits-wrap").hide();
    const traitsData = traits.map(item => `<li>${item}</li>`);
    $('#data_traits').html(traitsData.join(''));

    // left-pane
    if (!skills.length && !traits.length && !externalLinks.length) {
        $('#left-pane').hide();
    }

    // story
    const story = data.story;
    story ? setStoryData(story) : $('#data_story-tab').hide();

    // testimonials
    const testimonials = data.testimonials|| [];
    testimonials.length ? setTestominalsData(testimonials) : $('#data_testimonials-tab').hide();
    
    // endorsements
    const endorsements = data.endorsements|| [];
    endorsements.length ? setEndorsementsData(endorsements) : $('#data_endorsements-tab').hide();
    
    // right-pane
    if ($('#pills-tab .nav-link:visible').length) $('#pills-tab .nav-link:visible')[0].click();
    if (!endorsements.length && !testimonials.length && !story) {
        $('#right-pane').hide();
    }
}

function setStoryData(story) {
    const storyData = `<div class="card mb-2" style="width: 100%;">
    <div class="card-body">
        <p class="card-text">${story.text}</p>
    </div>
    </div>`;
    $('#data_story').html(storyData);
}

function setEndorsementsData(endorsements) {
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
    $('#data_endorsements').html(endorsementsData.join('') || noDataCard);
}

function setTestominalsData(testimonials) {
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
    $('#data_testimonials').html(testimonialsData.join('') || noDataCard);
}
