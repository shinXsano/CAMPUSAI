export type AcademicMode = 'socratic' | 'explain_simple' | 'deep_dive' | 'exam_prep';

export type SubjectCategory = 
  | 'Computer Science' 
  | 'Mathematics' 
  | 'Natural Sciences' 
  | 'Economics & Business' 
  | 'Humanities & Social Sciences' 
  | 'Engineering';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  gradeTarget: string;
  currentGrade: string;
  term: string;
  color: string;
  syllabusSnippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  subject?: string;
  mode?: AcademicMode;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint: string;
  concept: string;
  keyFormula?: string;
  mastery?: 'new' | 'learning' | 'mastered';
}

export interface AnnotationItem {
  lineOrQuote: string;
  suggestion: string;
  reason: string;
}

export interface ReviewResult {
  overallGradeEstimate: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionItems: string[];
  annotations: AnnotationItem[];
}

export interface MilestoneItem {
  title: string;
  week: number;
  weight: string;
  tips: string;
}

export interface WeeklyRoadmapItem {
  week: number;
  topic: string;
  readings: string;
  deliverables: string;
}

export interface GradeWeightItem {
  component: string;
  percentage: string;
}

export interface SyllabusData {
  courseTitle: string;
  credits: number;
  difficultyRating?: string;
  weeklyWorkloadHours: string;
  gradeWeighting: GradeWeightItem[];
  keyMilestones: MilestoneItem[];
  studyStrategy: string[];
  weeklyRoadmap: WeeklyRoadmapItem[];
}

export interface CampusAdvisorResult {
  title: string;
  actionPlan: string[];
  draftTemplate?: string;
  keyLocationsOrHours?: Array<{ place: string; note: string }>;
}

export interface StudySpot {
  id: string;
  name: string;
  building: string;
  noiseLevel: 'Silent Floor' | 'Quiet Whisper' | 'Collaborative Buzz';
  outlets: 'Abundant' | 'Moderate' | 'Limited';
  crowdLevel: 'Low' | 'Medium' | 'Peak';
  bestHours: string;
}
