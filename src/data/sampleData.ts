import { Course, Flashcard, StudySpot } from '../types/index.ts';

export const UNIVERSITIES = [
  'UC Berkeley',
  'Stanford University',
  'MIT',
  'UT Austin',
  'Carnegie Mellon',
  'University of Toronto',
  'Oxford University',
  'Harvard University',
  'Georgia Tech',
  'Columbia University',
  'Custom University',
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cs61b',
    code: 'CS 61B',
    name: 'Data Structures & Algorithms',
    credits: 4,
    gradeTarget: 'A',
    currentGrade: 'A-',
    term: 'Fall 2026',
    color: '#3B82F6', // Blue
    syllabusSnippet: `Course covers fundamental data structures (HashMaps, Red-Black Trees, Heaps, Disjoint Sets, Graphs) and asymptotic analysis. Grading: 3 Midterms (35%), Final (30%), Projects & Homework (30%), Participation (5%). Prerequisites: Introductory Programming.`,
  },
  {
    id: 'math53',
    code: 'MATH 53',
    name: 'Multivariable Calculus',
    credits: 4,
    gradeTarget: 'A',
    currentGrade: 'A',
    term: 'Fall 2026',
    color: '#8B5CF6', // Purple
    syllabusSnippet: `Vector calculus, partial derivatives, multiple integrals, Green's Theorem, Stokes' Theorem, and the Divergence Theorem. Grading: Weekly Problem Sets (20%), Midterm 1 & 2 (40%), Cumulative Final Exam (40%).`,
  },
  {
    id: 'phys7a',
    code: 'PHYS 7A',
    name: 'Physics for Scientists: Mechanics & Waves',
    credits: 4,
    gradeTarget: 'A-',
    currentGrade: 'B+',
    term: 'Fall 2026',
    color: '#0EA5E9', // Sky
    syllabusSnippet: `Newtonian mechanics, momentum, rotational dynamics, harmonic oscillations, and wave kinematics. Labs require pre-lab write-ups and formal lab reports. Midterm 1 (20%), Midterm 2 (20%), Final (35%), Labs & Homework (25%).`,
  },
  {
    id: 'econ100a',
    code: 'ECON 100A',
    name: 'Microeconomic Theory & Optimization',
    credits: 4,
    gradeTarget: 'A',
    currentGrade: 'A',
    term: 'Fall 2026',
    color: '#10B981', // Emerald
    syllabusSnippet: `Consumer choice, utility maximization with Lagrange multipliers, production theory, competitive equilibrium, monopoly price discrimination, and game theory. Problem Sets (25%), Midterms (35%), Final (40%).`,
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'What guarantees that an AVL Tree or Red-Black Tree maintains O(log n) search time?',
    back: 'Strict self-balancing invariants (AVL: height difference between left and right subtrees <= 1; Red-Black: no two red nodes adjacent, equal black-height). When violated after insertion/deletion, tree rotations (left/right) restore the invariant in O(log n) time.',
    hint: 'Think about tree height constraints and pointer rotations.',
    concept: 'Balanced Search Trees',
    keyFormula: 'Height h <= 1.44 log2(n + 2)',
    mastery: 'mastered',
  },
  {
    id: 'fc-2',
    front: 'State the geometric and physical intuition behind Stokes\' Theorem.',
    back: 'It equates the macroscopic line integral of a vector field around a closed boundary curve to the microscopic circulation (curl) across the oriented surface bounded by that curve.',
    hint: 'Relates a boundary 1D closed loop to the 2D surface interior.',
    concept: 'Vector Calculus',
    keyFormula: '∮_∂S F · dr = ∬_S (∇ × F) · dS',
    mastery: 'learning',
  },
  {
    id: 'fc-3',
    front: 'Why does Quicksort degrade to O(n²) worst-case runtime and how is it mitigated?',
    back: 'When the chosen pivot is consistently the minimum or maximum element (e.g. sorted input with naive first-element pivot). Mitigated by Randomized Pivot Selection, Median-of-Three, or IntroSort (fallback to HeapSort if recursion depth exceeds 2 log n).',
    hint: 'Unbalanced partitions (1 vs n-1 items each step).',
    concept: 'Algorithmic Complexity',
    keyFormula: 'T(n) = T(n-1) + O(n) = O(n²)',
    mastery: 'new',
  },
  {
    id: 'fc-4',
    front: 'In consumer theory, what does the tangency condition (MRS = Px / Py) physically signify?',
    back: 'The subjective rate at which the consumer is willing to trade good Y for good X (marginal rate of substitution) exactly equals the market rate of exchange dictated by relative prices, maximizing utility subject to the budget constraint.',
    hint: 'Slope of indifference curve equals slope of budget line.',
    concept: 'Microeconomic Optimization',
    keyFormula: 'MRS = - (∂U/∂x) / (∂U/∂y) = - Px / Py',
    mastery: 'learning',
  },
  {
    id: 'fc-5',
    front: 'Explain the difference between Dijkstra\'s Algorithm and A* Search.',
    back: 'Dijkstra explores radially outward based purely on path cost g(n) from start. A* guides search toward the goal using an admissible and consistent heuristic h(n), evaluating f(n) = g(n) + h(n), reducing unnecessary node expansions.',
    hint: 'One is uninformed; the other uses a heuristic distance estimate.',
    concept: 'Graph Search Heuristics',
    keyFormula: 'f(n) = g(n) + h(n)',
    mastery: 'new',
  },
];

export const CAMPUS_STUDY_SPOTS: StudySpot[] = [
  {
    id: 'spot-1',
    name: 'Doe Memorial Library — 3rd Floor North Reading Room',
    building: 'Doe Library',
    noiseLevel: 'Silent Floor',
    outlets: 'Abundant',
    crowdLevel: 'Medium',
    bestHours: '8:00 AM – 11:30 AM',
  },
  {
    id: 'spot-2',
    name: 'Engineering & Mathematical Sciences Atrium',
    building: 'Bechtel / Evans Hall',
    noiseLevel: 'Collaborative Buzz',
    outlets: 'Abundant',
    crowdLevel: 'Peak',
    bestHours: '1:00 PM – 4:00 PM',
  },
  {
    id: 'spot-3',
    name: 'Kresge Bioscience Library Stacks',
    building: 'Valley Life Sciences',
    noiseLevel: 'Quiet Whisper',
    outlets: 'Moderate',
    crowdLevel: 'Low',
    bestHours: 'All day (hidden gem)',
  },
  {
    id: 'spot-4',
    name: 'Student Union Terrace Cafe Lounge',
    building: 'Martin Luther King Jr. Student Union',
    noiseLevel: 'Collaborative Buzz',
    outlets: 'Moderate',
    crowdLevel: 'Peak',
    bestHours: '4:00 PM – 7:00 PM',
  },
];

export const SAMPLE_ESSAY = `Title: Algorithmic Gatekeepers: Epistemic Bubbles and the Fragmentation of Public Discourse

In the digital commons of the twenty-first century, information dissemination has transitioned from curated journalistic editorial boards to predictive machine learning algorithms optimizing for user engagement. While proponents argue that personalization democratizes information retrieval, algorithmic filtering intrinsically amplifies cognitive confirmation bias. 

By categorizing users into high-dimensional preference clusters, platform recommendation architectures systematically obscure dissenting perspectives. Consequently, citizens encounter self-reinforcing informational silos, precipitating heightened political polarization and degrading public deliberation. To preserve democratic discourse, systemic algorithmic transparency and public-interest recommender models must be enacted.`;

export const SAMPLE_CODE = `// Implementation: Least Recently Used (LRU) Cache
// Target: O(1) get and O(1) put operations

class LRUCache {
  private capacity: number;
  private map: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key)!;
    // Refresh access order in JS Map
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Evict least recently used (first key in map iterator)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
    this.map.set(key, value);
  }
}`;
