export const SEO = {
    'meenakshi-malik': {
        title: 'Meenakshi Malik | The Good Human',
        description: 'Meenakshi Malik profile on The Good Human featuring testimonials, endorsements, skills, and traits.',
        keywords: "Meenakshi Malik, The Good Human, testimonials, endorsements, profile page, personal recognition, mental health clinic Gurgaon, therapy and counselling, certified therapists, couples counselling, community appreciation, social proof, professional profile",
    },
    'rishika-vashishtha': {
        title: 'Rishika Vashishtha | The Good Human',
        description: 'Rishika Vashishtha profile on The Good Human with testimonials, endorsements, skills, and personal recognition details.',
        keywords: "Rishika Vashishtha, The Good Human, testimonials, endorsements, profile page, personal recognition, mental health clinic Gurgaon, therapy and counselling, certified therapists, LGBTQ affirmative therapy, community appreciation, social proof, professional profile",
    },
    'core-mind-wellness': {
        title: 'Core Mind Wellness | The Good Human',
        description: 'Core Mind Wellness, Sector 28, Gurgaon: certified therapists for anxiety, depression, couples, child and family counselling. Read testimonials and endorsements on The Good Human.',
        keywords: "Core Mind Wellness, mental health clinic Gurgaon, therapy and counselling, certified therapists, anxiety treatment, depression counselling, addiction recovery, couples counselling, child counselling, family therapy, LGBTQ affirmative therapy, psychiatrist consultation, stress management, OCD treatment, ADHD therapy",
    },
    'default': {
        title: 'The Good Human',
        description: "The Good Human is a platform to recognize good human beings through testimonials and endorsements from friends, family, and colleagues.",
        keywords: "The Good Human, good human profiles, testimonials, endorsements, personal reputation, recognition platform, profile sharing, social proof, community appreciation, human stories",
    }
}

// Appends tracking params so the business can see visits referred by The Good Human.
export function withUtm(url, medium = 'profile') {
    try {
        const u = new URL(url);
        if (!/^https?:$/.test(u.protocol)) return url;
        u.searchParams.set('utm_source', 'thegoodhuman');
        u.searchParams.set('utm_medium', medium);
        return u.toString();
    } catch {
        return url;
    }
}

// Per-profile presentation extras that are not part of the profile JSON on S3.
//   cta: primary call-to-action button      mapQuery: Google Maps embed query
//   utmPlatforms: externalLinks platforms that get UTM params
//   mentalHealthNote: show the crisis-helpline note under the story
export const PROFILE_EXTRAS = {
    'core-mind-wellness': {
        cta: { label: 'Book a session', url: 'https://coremind-wellness.com/' },
        mapQuery: 'Core Mind Wellness, Sector 28, Gurgaon',
        utmPlatforms: ['website', 'blog'],
        mentalHealthNote: true,
    },
}

export const FEATURED_PROFILES = [
    {
        slug: 'core-mind-wellness',
        name: 'Core Mind Wellness',
        blurb: 'Certified therapists in Sector 28, Gurgaon offering individual, couples, child and family therapy, with an LGBTQ+ affirmative, compassionate approach.',
        website: 'https://coremind-wellness.com/',
    },
]