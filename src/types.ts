export interface Subject {
  name: string;
  topics: string[];
  difficulty: number; // 1-5
  proficiency: number; // 1-5
  urgency: number; // 1-5
  dueDate?: string;
  examDate?: string;
}

export interface Commitment {
  name: string;
  days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  startTime: string;
  endTime: string;
}

export interface UserData {
  wakeUpTime: string;
  bedTime: string;
  peakHours: string[];
  studyHoursPerDay: number;
  subjects: Subject[];
  fixedCommitments: Commitment[];
  learningStyle: 'visual' | 'auditory' | 'reading/writing' | 'kinesthetic';
  preferredMethods: string[];
  avoidMethods: string[];
  studyLocations: string[];
  availableResources: string[];
  distractions: string[];
  techTools: string[];
  sleepHours: number;
  exerciseRoutine: string;
  mealTimes: string[];
  stressManagement: string[];
}

export interface TimeBlock {
  startTime: string;
  endTime: string;
  activity: 'Study' | 'Break' | 'Commitment' | 'Free' | 'Review';
  subject: string | null;
}

export interface Task {
  subject: string;
  task: string;
  duration: string;
  completed: boolean;
}

export interface ReviewSlot {
  day: string;
  time: string;
  subjects: string[];
}

export interface BreakPattern {
  duration: string;
  repeat: number;
  longBreak: string;
}

export interface SubjectProgress {
  name: string;
  progress: number;
  lastStudied: string | null;
}

export interface ScheduleData {
  weeklySchedule: {
    [key: string]: TimeBlock[];
  };
  dailyTasks: {
    [key: string]: Task[];
  };
  studyTechniques: string[];
  breakPatterns: BreakPattern[];
  reviewSlots: ReviewSlot[];
  progressTracking: {
    subjects: SubjectProgress[];
  };
  contingencyPlans: string[];
}