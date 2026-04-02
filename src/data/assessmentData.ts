export interface Question {
  id: string;
  dimension: string;
  text: string;
  isBehavioral?: boolean;
}

export interface Dimension {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  actionPlan: string[];
}

export const dimensions: Dimension[] = [
  {
    id: "clarity",
    name: "Clarity",
    shortName: "Clarity",
    description:
      "How clear you are on direction and goals (career concern, planning).",
    icon: "lightbulb",
    actionPlan: [
      "Write a one-sentence career vision for 3 years from now and pin it where you see it daily.",
      "List the top 3 skills required for your target role and map a 90-day learning plan to each.",
      "Block 30 minutes this week to review your career direction and identify one concrete next step.",
    ],
  },
  {
    id: "ownership",
    name: "Ownership",
    shortName: "Ownership",
    description:
      "How much you take control and follow through (career control).",
    icon: "assignment_ind",
    actionPlan: [
      "Identify one specific career action (course, project, or application) and commit to starting it this week.",
      "Start an 'Achievements Log' — track wins, metrics, and impact weekly so you can speak to your value at any time.",
      "If you feel stuck, generate 3 options to move forward on your own before waiting for someone else to fix it.",
    ],
  },
  {
    id: "curiosity",
    name: "Curiosity",
    shortName: "Curiosity",
    description:
      "How actively you explore options and learn (career curiosity, self-development).",
    icon: "explore",
    actionPlan: [
      "Schedule one 'career experiment' this month — a side project, stretch task, or role-shadow to test a new direction.",
      "Reach out to one person in a role you're curious about and ask for a 20-minute informational chat.",
      "Subscribe to one industry newsletter or podcast and spend 15 minutes weekly on active industry learning.",
    ],
  },
  {
    id: "confidence",
    name: "Confidence",
    shortName: "Confidence",
    description:
      "How confident and resilient you feel in pursuing opportunities.",
    icon: "verified",
    actionPlan: [
      "List 5 specific achievements from the last year as evidence of your competence — revisit this list before any high-stakes moment.",
      "Apply for one role or opportunity that feels slightly out of reach — treat any outcome as a valuable data point.",
      "Practice your 60-second career pitch out loud three times this week until it feels natural and authentic.",
    ],
  },
  {
    id: "network",
    name: "Network & Visibility",
    shortName: "Network",
    description:
      "How well you build relationships and showcase yourself (networking, communication).",
    icon: "hub",
    actionPlan: [
      "Update your LinkedIn headline and 'About' section this week to clearly reflect the roles you're targeting.",
      "Message one person in your existing network this week — share a useful insight, not just a request for help.",
      "Identify 3 people who could serve as mentors or referral partners and make a plan to reconnect with each.",
    ],
  },
];

export const questions: Question[] = [
  // Clarity
  {
    id: "c1",
    dimension: "clarity",
    text: "I can describe the kind of work I want to be doing in the next 3 years in one clear sentence.",
  },
  {
    id: "c2",
    dimension: "clarity",
    text: "I know which skills I must build in the next 12 months to reach my next role.",
  },
  {
    id: "c3",
    dimension: "clarity",
    text: "I regularly review my career direction instead of just 'seeing what happens'.",
  },

  // Ownership
  {
    id: "o1",
    dimension: "ownership",
    text: "In the last 90 days, I've taken a specific action (course, project, application) to move my career forward.",
    // isBehavioral: true,
  },
  {
    id: "o2",
    dimension: "ownership",
    text: "If I feel stuck at work, I create options instead of waiting for my manager or company to fix it.",
  },
  {
    id: "o3",
    dimension: "ownership",
    text: "I track my achievements so I can clearly show my impact.",
  },

  // Curiosity
  {
    id: "cu1",
    dimension: "curiosity",
    text: "I consistently seek out new information about my industry or roles I'm interested in.",
  },
  {
    id: "cu2",
    dimension: "curiosity",
    text: "I talk to people in roles I aspire to, even if it feels uncomfortable at first.",
  },
  {
    id: "cu3",
    dimension: "curiosity",
    text: "I treat my career like an experiment and regularly try small tests (side projects, stretch tasks, etc.).",
  },

  // Confidence
  {
    id: "cf1",
    dimension: "confidence",
    text: "I believe my skills will stay valuable even if my current role disappeared tomorrow.",
  },
  {
    id: "cf2",
    dimension: "confidence",
    text: "Rejection (e.g., from an application or promotion) motivates me to adjust and try again.",
  },
  {
    id: "cf3",
    dimension: "confidence",
    text: "I feel comfortable asking for promotions, raises, or new opportunities when I'm ready.",
  },

  // Network & Visibility
  {
    id: "n1",
    dimension: "network",
    text: "I have at least 3–5 people I could message today for advice or referrals related to my next move.",
  },
  {
    id: "n2",
    dimension: "network",
    text: "My online presence (e.g., LinkedIn, portfolio, social) clearly reflects the kind of roles I want.",
  },
  {
    id: "n3",
    dimension: "network",
    text: "I intentionally add value to my network (sharing insights, connections, support), not just ask for help.",
  },
];

export const archetypes = [
  {
    range: [75, 100],
    label: "Strategic Climber",
    tagline: "High Readiness",
    description:
      "You are driving your career with precision. Your high scores across key dimensions indicate you are ready for your next big professional leap.",
  },
  {
    range: [50, 74],
    label: "Emerging Professional",
    tagline: "Medium Readiness",
    description:
      "You have a solid foundation, but there are key gaps in specific dimensions—likely ownership or visibility—that are preventing you from reaching your full potential.",
  },
  {
    range: [0, 49],
    label: "Quiet Passenger",
    tagline: "Low Readiness",
    description:
      "You might be coasting. It's time to take the wheel, define your direction, and start proactively building the skills your future self will thank you for.",
  },
];

export const dimensionInsights: Record<
  string,
  { low: string; solid: string; strong: string }
> = {
  clarity: {
    low: "Your career direction is currently a 'black box'. Without a clear 3-year vision, you're likely working hard but not moving forward.",
    solid:
      "You have a general sense of where you're going, but your planning lacks the granular detail needed for elite growth.",
    strong:
      "Your clarity is exceptionally high. You know exactly what you want and which skills you need to get there.",
  },
  ownership: {
    low: "You're waiting for permission to grow. Taking more 'career control' is your biggest lever for advancement right now.",
    solid:
      "You're taking action, but it's inconsistent. Moving from 'responding to work' to 'creating work' is your next step.",
    strong:
      "You treat your career like a business. Your high ownership means you don't wait for opportunities—you build them.",
  },
  curiosity: {
    low: "You're focused only on the 'now'. Expanding your industry knowledge will help you see opportunities before others do.",
    solid:
      "You're curious, but your exploration is passive. Start conducting small 'career experiments' to test your interests.",
    strong:
      "You're an active learner. Your curiosity keeps you adaptable and ahead of industry shifts.",
  },
  confidence: {
    low: "Self-doubt might be holding you back from asking for what you're worth. Your skills are more valuable than you think.",
    solid:
      "You're confident in familiar territory. Building resilience to rejection will help you go for bigger roles.",
    strong:
      "You represent yourself with authority. Your belief in your value makes you a strong candidate for leadership.",
  },
  network: {
    low: "You're working in a vacuum. Building a small group of mentors and referral partners is your priority.",
    solid:
      "You have connections, but they're not a 'network'. Start intentionally adding value to others to bake reciprocity into your career.",
    strong:
      "You have high professional visibility. Your network is an active asset that creates 'lucky' opportunities for you.",
  },
};
