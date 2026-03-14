type CardData = {
    id: number
    x: number
    y: number
    width: number
    height: number
    title: string[]
    hoverText: string[]
    link: string
    img?: string
    filter?: boolean
}

export const cards: CardData[] = [
    {
        id: 1,
        x: 0,
        y: 0,
        width: 0.55,
        height: 0.5,
        title: ["HTML", "ThreeJS", "GSAP", "Tailwind", "TypeScript", "Next.js", "..."],
        hoverText: ["2025", "The newest protofolio besides the one you are viewing"],
        link: "https://super-cool--zeta.vercel.app/",
        img: "/assets/FouthP.png"
    },
    {
        id: 2,
        x: 0.6,
        y: 0,
        width: 0.4,
        height: 0.9,
        title: ["HTML", "SCSS", "JavaScript", "React", "Git", "Blender", "Node.js", "Photoshop", "..."],
        hoverText: ['2024',
            'My first project',
            'shows detials about the way I self taught coding and some other skills helpful for frontend development'],
        link: "https://know-nick.netlify.app/",
        img: "/assets/FirstP.png"
    },
    {
        id: 3,
        x: 0,
        y: 0.55,
        width: 0.25,
        height: 0.7,
        title: ["Python", "Django", "PostgreSQL", "HTML", "Tailwind", "TypeScript", "React", "..."],
        hoverText: ["2025", "A full stack canlendar web built for am interview",],
        link: "https://www.loom.com/share/000d06b369634d60a314d50ba2a9f352?sid=2a2bc59f-8a08-4e71-963f-e03455a12bf3",
        img: "/assets/FifthP.png"
    },

    {
        id: 4,
        x: 0.3,
        y: 0.55,
        width: 0.25,
        height: 0.7,
        title: ["HTML", "Tailwind", "TypeScript", "React Native", "Expo", "Supabase", "..."],
        hoverText: ["2025", "A mobile app built with React Native and Expo, just to show I can build mobile app as well", "the function was to book interviews with me", "I'm no more using it! The free server is down possibly", "This link takes you to a Youtube video demonstration"],
        link: "https://www.youtube.com/watch?v=yp6JHzfmwR4&feature=youtu.be",
        img: "/assets/FirstApp.png"
    },

    {
        id: 5,
        x: 0.6,
        y: 0.95,
        width: 0.4,
        height: 0.3,
        title: ["HTML", "Tailwind", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "..."],
        hoverText: ["2024", "A third protofolio", "I wrote backend in Node.js and PostgreSQL for a fake book borrowing website, jsut to show I was able to write simple backend there"],
        link: "https://fake-book-borrow.vercel.app/profile/homePage",
        img: "/assets/ThirdP.png"
    },

    {
        id: 6,
        x: 0,
        y: 1.3,
        width: 0.3,
        height: 0.3,
        title: ["Nothing here",
            "just a botton to next part",
            ":P"],
        hoverText: ["Ready?", "Click then"],
        link: "#",
        img: "/assets/nextButton.png",
        filter: false
    },

    {
        id: 7,
        x: 0.35,
        y: 1.3,
        width: 0.65,
        height: 0.3,
        title: ["HTML", "CSS", "JS", "Vue3", "Pinia", "Google map API", "blender", "Photoshop", "..."],
        hoverText: ["2024", "I made a loop gif in blender for the background XD", "and I also used google map API to show where I lived and I'm still living in"],
        link: "https://nick-in-sea.netlify.app/",
        img: "/assets/SecondP.png"
    },


]