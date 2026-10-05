import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    model: 'gemini-3.8-flash',
  });
});

// 1. AI Study Copilot / Chat
app.post('/api/chat', async (req, res) => {
  const { message, subject = 'General Academics', mode = 'socratic', history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstructionsByMode: Record<string, string> = {
    socratic: `You are Campus AI's Socratic Study Copilot for university students in the course: ${subject}. 
Do not simply give away full answers to homework or problem sets. Instead, ask probing questions, illuminate underlying principles, break down the problem into logical micro-steps, and guide the student so they achieve genuine conceptual understanding. Always be encouraging, intellectually rigorous, and structured. Use Markdown formatting with LaTeX-style notation where appropriate.`,
    explain_simple: `You are Campus AI's Feynman Conceptual Tutor for university students studying ${subject}. 
Explain concepts using intuitive mental models, relatable real-world analogies, and zero academic jargon without sacrificing precision. After explaining, provide a quick one-sentence summary and a self-test question.`,
    deep_dive: `You are Campus AI's Graduate Research & Rigorous Academic Advisor for ${subject}. 
Provide an in-depth, rigorous academic breakdown including formal definitions, theoretical foundations, edge cases, real-world research applications, and academic literature context.`,
    exam_prep: `You are Campus AI's High-Yield Exam Strategist for university exams in ${subject}. 
Focus on high-probability exam concepts, common trap pitfalls students fall into, step-by-step problem-solving heuristics, and active recall checkpoints.`,
  };

  const sysInstruction = systemInstructionsByMode[mode] || systemInstructionsByMode.socratic;

  if (!ai) {
    // High quality contextual fallback response when API key is not configured
    const simulatedResponse = `### [Campus AI · ${subject} Insight]

**Core Principle:**
To tackle **"${message.slice(0, 80)}"**, let's isolate the foundational mechanism:

1. **Step 1: Grounding the Variables**
   Identify the primary knowns and governing constraints. What fundamental theorem or governing law dictates this behavior?
2. **Step 2: Mental Checkpoint**
   If you perturbed one parameter (e.g., doubling the load or shifting the equilibrium), which direction would the resulting state transition?
3. **Step 3: Verification Test**
   Try formulating the intermediate state before calculating the final expression.

*Reflection Question for You:* What is the exact constraint preventing a direct shortcut here? Let's work through your initial intuition together!`;

    return res.json({ text: simulatedResponse });
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        }))
      : [];

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: `[Subject: ${subject}] Student Question:\n${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Unable to generate response. Please try again.';
    res.json({ text: reply });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({
      error: 'Failed to process AI response',
      details: err?.message || String(err),
    });
  }
});

// 2. Flashcards Generator
app.post('/api/flashcards', async (req, res) => {
  const { notes, subject = 'General', count = 5, difficulty = 'medium' } = req.body;

  if (!notes || typeof notes !== 'string') {
    return res.status(400).json({ error: 'Study material or notes required' });
  }

  if (!ai) {
    // High quality intelligent mock flashcards
    const fallbackCards = [
      {
        front: `What is the core theorem or definition underlying: "${notes.slice(0, 45)}..."?`,
        back: `It formalizes the relationship between the inputs and equilibrium state, ensuring stability and deterministic convergence under bounded conditions.`,
        hint: `Think about conservation laws and asymptotic bounds.`,
        concept: `${subject} Foundations`,
        keyFormula: `O(n log n) or dS >= 0`,
      },
      {
        front: `What is the most frequent trap students encounter when applying this in ${subject}?`,
        back: `Assuming linearity or neglecting edge cases where boundary conditions fail. Always verify preconditions before applying the formula.`,
        hint: `Check zero-division, null pointers, or non-invertible matrices.`,
        concept: `Trap Avoidance`,
      },
      {
        front: `How does this concept connect to real-world industrial or academic applications?`,
        back: `It provides the theoretical backbone for optimization pipelines, resilient system architectures, and statistical inferences.`,
        hint: `Look at scalability and robustness.`,
        concept: `Practical Application`,
      },
    ];
    return res.json({ cards: fallbackCards.slice(0, count) });
  }

  try {
    const prompt = `Generate ${count} high-yield university-level study flashcards based on the following lecture notes or textbook excerpt for ${subject} at difficulty level ${difficulty}:

Notes / Syllabus Text:
"""
${notes}
"""

Ensure each card tests active recall and conceptual mastery rather than trivial trivia.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: {
                    type: Type.STRING,
                    description: 'The question, prompt, or scenario on the front of the flashcard.',
                  },
                  back: {
                    type: Type.STRING,
                    description: 'Clear, concise, conceptually rigorous answer with key intuition.',
                  },
                  hint: {
                    type: Type.STRING,
                    description: 'A subtle hint that triggers active recall without giving away the full answer.',
                  },
                  concept: {
                    type: Type.STRING,
                    description: 'The specific subtopic or concept tag.',
                  },
                  keyFormula: {
                    type: Type.STRING,
                    description: 'Optional relevant equation, syntax snippet, or key formula if applicable.',
                  },
                },
                required: ['front', 'back', 'hint', 'concept'],
              },
            },
          },
          required: ['cards'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{"cards":[]}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Flashcard error:', err);
    res.status(500).json({ error: 'Failed to generate flashcards', details: err?.message });
  }
});

// 3. Academic Reviewer (Essay & Code Auditor)
app.post('/api/review', async (req, res) => {
  const { type = 'essay', content, prompt = '', rubric = 'rigorous university level' } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Content to review is required' });
  }

  if (!ai) {
    const isCode = type === 'code';
    return res.json({
      overallGradeEstimate: isCode ? 'B+ (Solid Architecture, Edge Cases Need Guardrails)' : 'A- (Strong Argumentation, Needs Citation Tightening)',
      summary: isCode
        ? 'The implementation achieves target algorithmic complexity but could improve in variable naming, input sanitization, and handling boundary states.'
        : 'The argument is lucid and persuasive with a well-defined thesis statement. Transitioning between counter-arguments in the third paragraph needs tighter synthesis.',
      strengths: isCode
        ? ['Clean modular decomposition', 'Optimal average-case runtime complexity', 'Idiomatic control flow']
        : ['Clear and compelling thesis statement', 'Effective rhetorical framing', 'Sophisticated academic tone'],
      weaknesses: isCode
        ? ['Missing defensive checks for null/empty collections', 'Potential memory leak in unclosed resources', 'Lacks inline docstrings for complex logic']
        : ['Paragraph 2 transitions abruptly without a bridging premise', 'Secondary claim in section 3 lacks empirical attribution', 'Passive voice overused in conclusion'],
      actionItems: isCode
        ? ['Add boundary guard clauses at line 1', 'Refactor nested loops into helper functions', 'Include unit tests for edge cases']
        : ['Add evidence citation for empirical assertions', 'Convert passive verbs to active analytical verbs', 'Reframe the conclusion to project future research'],
      annotations: [
        {
          lineOrQuote: content.slice(0, Math.min(60, content.length)),
          suggestion: isCode ? 'Verify type safety or null check here' : 'Elevate analytical nuance with a transitional phrase like "Furthermore" or "Conversely"',
          reason: 'Improves academic rigor and structural precision.',
        },
      ],
    });
  }

  try {
    const isCode = type === 'code';
    const instructions = isCode
      ? `You are an expert Professor of Computer Science reviewing student code submission. Evaluate time complexity (Big-O), space complexity, potential bugs, style, edge cases, and code hygiene.`
      : `You are an elite University Academic Writing Fellow. Evaluate thesis clarity, argumentation validity, rhetorical cohesion, scholarly tone, and citation mechanics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Task: Review this student ${type} according to rubric: "${rubric}". Context/Prompt: "${prompt}"

Student Submission:
"""
${content}
"""`,
      config: {
        systemInstruction: instructions,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallGradeEstimate: {
              type: Type.STRING,
              description: 'e.g. "A- (Strong Logic)", "B+ (High potential, minor flaws)"',
            },
            summary: {
              type: Type.STRING,
              description: 'Executive academic appraisal of the submission.',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of specific strengths demonstrated.',
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of areas requiring immediate correction.',
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Concrete step-by-step revision items.',
            },
            annotations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  lineOrQuote: { type: Type.STRING, description: 'Excerpt or code line referenced' },
                  suggestion: { type: Type.STRING, description: 'Specific suggested rewrite or fix' },
                  reason: { type: Type.STRING, description: 'Academic or technical rationale' },
                },
                required: ['lineOrQuote', 'suggestion', 'reason'],
              },
            },
          },
          required: ['overallGradeEstimate', 'summary', 'strengths', 'weaknesses', 'actionItems', 'annotations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Review error:', err);
    res.status(500).json({ error: 'Failed to complete review', details: err?.message });
  }
});

// 4. Syllabus Breakdown & Milestones
app.post('/api/syllabus-breakdown', async (req, res) => {
  const { syllabusText, courseName = 'University Course' } = req.body;

  if (!syllabusText || typeof syllabusText !== 'string') {
    return res.status(400).json({ error: 'Syllabus text is required' });
  }

  if (!ai) {
    return res.json({
      courseTitle: courseName,
      credits: 4,
      difficultyRating: 'Rigorous / High-Yield',
      weeklyWorkloadHours: '10 - 12 hrs/wk',
      gradeWeighting: [
        { component: 'Midterm Exam 1 & 2', percentage: '35%' },
        { component: 'Final Exam', percentage: '30%' },
        { component: 'Problem Sets / Projects', percentage: '25%' },
        { component: 'Section & Discussion', percentage: '10%' },
      ],
      keyMilestones: [
        { title: 'Diagnostic Problem Set', week: 2, weight: '5%', tips: 'Verify mathematical prerequisites early.' },
        { title: 'Midterm Exam 1', week: 6, weight: '15%', tips: 'Review past exam archives and active recall flashcards.' },
        { title: 'Semester Project Milestone', week: 10, weight: '15%', tips: 'Have working MVP ready for professor office hours check-in.' },
        { title: 'Comprehensive Final', week: 15, weight: '30%', tips: 'Simulate full timed practice tests in library quiet zone.' },
      ],
      studyStrategy: [
        'Read assigned literature before each lecture to turn class time into active consolidation.',
        'Attend office hours by Week 3 to establish relationship with instructor.',
        'Form a 3-4 person study pod for peer peer-review on weekly problem sets.',
      ],
      weeklyRoadmap: [
        { week: 1, topic: 'Foundational Models & Axioms', readings: 'Chapters 1-2', deliverables: 'Enrollment quiz' },
        { week: 2, topic: 'Linear Transformations & State Spaces', readings: 'Chapter 3', deliverables: 'Problem Set 1' },
        { week: 3, topic: 'Optimization Heuristics', readings: 'Chapter 4', deliverables: 'Problem Set 2' },
        { week: 4, topic: 'Advanced Synthesis & Case Studies', readings: 'Chapter 5', deliverables: 'Milestone 1' },
      ],
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an Academic Success Dean. Analyze this university course syllabus for "${courseName}":
"""
${syllabusText}
"""
Extract the workload breakdown, grade weights, major high-stakes exam milestones, weekly topics, and concrete academic study strategies for getting an A.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courseTitle: { type: Type.STRING },
            credits: { type: Type.NUMBER },
            difficultyRating: { type: Type.STRING },
            weeklyWorkloadHours: { type: Type.STRING },
            gradeWeighting: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  component: { type: Type.STRING },
                  percentage: { type: Type.STRING },
                },
                required: ['component', 'percentage'],
              },
            },
            keyMilestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  week: { type: Type.NUMBER },
                  weight: { type: Type.STRING },
                  tips: { type: Type.STRING },
                },
                required: ['title', 'week', 'weight', 'tips'],
              },
            },
            studyStrategy: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            weeklyRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.NUMBER },
                  topic: { type: Type.STRING },
                  readings: { type: Type.STRING },
                  deliverables: { type: Type.STRING },
                },
                required: ['week', 'topic', 'readings', 'deliverables'],
              },
            },
          },
          required: ['courseTitle', 'credits', 'weeklyWorkloadHours', 'gradeWeighting', 'keyMilestones', 'studyStrategy', 'weeklyRoadmap'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Syllabus breakdown error:', err);
    res.status(500).json({ error: 'Failed to analyze syllabus', details: err?.message });
  }
});

// 5. Campus Navigator & Student Query / Advisor
app.post('/api/campus-query', async (req, res) => {
  const { query, campus = 'University Campus', category = 'general' } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (!ai) {
    return res.json({
      title: `Campus Guidance: ${query.slice(0, 50)}`,
      actionPlan: [
        'Check university registrar or department portal for official deadline calendar.',
        'Utilize campus library 4th floor for silent deep work sessions before 11:00 AM.',
        'Draft a concise, courteous email to the professor or head TA 48 hours prior to office hours.',
      ],
      draftTemplate: `Subject: ${campus} Question: Office Hours Clarification - [Course Name]\n\nDear Professor [Last Name],\n\nI am currently working through the concepts in Week 3 (specifically regarding the assignment prompt). I have reviewed the lecture notes and textbook chapter 4, and had a specific question regarding [specific concept].\n\nWould it be possible to discuss this during your office hours on [Day] at [Time]?\n\nThank you for your time,\n[Your Name]\nStudent ID: [ID]`,
      keyLocationsOrHours: [
        { place: 'Main University Library', note: 'Open 24/7 during midterm/finals week, 3rd floor quiet zone has charging hubs.' },
        { place: 'Student Academic Resource Center', note: 'Free drop-in peer tutoring Mon-Thu 10am-6pm.' },
      ],
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are the Campus AI Life & Academic Navigator for ${campus}.
Student Query: "${query}" (Category: ${category})
Provide a concise, practical, high-value guide. If the student is asking about emailing professors, asking for research, navigating grade disputes, or finding quiet study spots, include an action plan and an editable, polished email or schedule template.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            draftTemplate: {
              type: Type.STRING,
              description: 'Optional ready-to-copy email draft or checklist template.',
            },
            keyLocationsOrHours: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  place: { type: Type.STRING },
                  note: { type: Type.STRING },
                },
                required: ['place', 'note'],
              },
            },
          },
          required: ['title', 'actionPlan'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Campus query error:', err);
    res.status(500).json({ error: 'Failed to process campus query', details: err?.message });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
