export interface Question {
  id: string;
  dimension: string;
  text: string;
  isBehavioral?: boolean;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const dimensions: Dimension[] = [
  {
    id: "clarity",
    name: "Clarity",
    description:
      "How clear you are on direction and goals (career concern, planning).",
    icon: "lightbulb",
  },
  {
    id: "ownership",
    name: "Ownership",
    description:
      "How much you take control and follow through (career control).",
    icon: "assignment_ind",
  },
  {
    id: "curiosity",
    name: "Curiosity",
    description:
      "How actively you explore options and learn (career curiosity, self-development).",
    icon: "explore",
  },
  {
    id: "confidence",
    name: "Confidence",
    description:
      "How confident and resilient you feel in pursuing opportunities.",
    icon: "verified",
  },
  {
    id: "network",
    name: "Network & Visibility",
    description:
      "How well you build relationships and showcase yourself (networking, communication).",
    icon: "hub",
  },
];

export const questions: Question[] = [
  {
    id: "c1",
    dimension: "clarity",
    text: "I can describe the kind of work I want to be doing in the next 3 years in one clear sentence.",
  },
  {
    id: "o2",
    dimension: "ownership",
    text: "If I feel stuck at work, I create options instead of waiting for my manager or company to fix it.",
  },
  {
    id: "cu1",
    dimension: "curiosity",
    text: "I consistently seek out new information about my industry or roles I'm interested in.",
  },
  {
    id: "cf1",
    dimension: "confidence",
    text: "I believe my skills will stay valuable even if my current role disappeared tomorrow.",
  },
  {
    id: "n1",
    dimension: "network",
    text: "I have at least 3–5 people I could message today for advice or referrals related to my next move.",
  },
  {
    id: "b_cl",
    dimension: "clarity",
    text: "In the past 30 days, I have written down my specific career goals for the next 12 months.",
    isBehavioral: true,
  },
  {
    id: "b_ow",
    dimension: "ownership",
    text: "In the past 30 days, I have spent at least 2 hours on a project or skill that wasn't assigned to me.",
    isBehavioral: true,
  },
];

export const archetypes = [
  {
    range: [75, 100],
    label: "Strategic Climber",
    description:
      "High clarity, strong curiosity, and high ownership. You are driving your career with precision.",
  },
  {
    range: [50, 74],
    label: "Emerging Professional",
    description:
      "Solid scores across the board, but some gaps in ownership or visibility are holding you back.",
  },
  {
    range: [0, 49],
    label: "Quiet Passenger",
    description:
      "You might be coasting. It's time to take control and define your direction.",
  },
];
