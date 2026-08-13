export interface Award {
  name: string;
  prize: string;
  organizer: string;
  date: string;
  description?: string;
}

export const awards: Award[] = [
  {
    name: "Dongguk Tutoring (Industry-Academia Project 2)",
    prize: "Encouragement Award",
    organizer: "Dongguk University",
    date: "2025.12",
    description: "Mentor-mentee tutoring program on cloud computing",
  },
];
