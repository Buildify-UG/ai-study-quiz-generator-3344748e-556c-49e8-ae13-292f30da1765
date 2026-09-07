import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/pages/Index';

interface CreateQuizProps {
  onCreateQuiz: (quiz: {
    topic: string;
    notes: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionType: 'mixed' | 'mcq' | 'truefalse' | 'shortanswer';
    numQuestions: number;
    questions: Question[];
  }) => void;
}

const SAMPLE_QUESTIONS = {
  mcq: [
    {
      id: '1',
      question: 'What is the capital of France?',
      type: 'mcq' as const,
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
      explanation: 'Paris is the capital and largest city of France, located in the north-central part of the country.',
    },
    {
      id: '2',
      question: 'Which planet is known as the Red Planet?',
      type: 'mcq' as const,
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
      explanation: 'Mars is often called the Red Planet because of its reddish appearance due to iron oxide on its surface.',
    },
    {
      id: '3',
      question: 'What is the chemical symbol for Gold?',
      type: 'mcq' as const,
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correctAnswer: 'Au',
      explanation: 'Au is the chemical symbol for gold, derived from its Latin name "aurum".',
    },
  ],
  truefalse: [
    {
      id: '4',
      question: 'The Great Wall of China is visible from space with the naked eye.',
      type: 'truefalse' as const,
      correctAnswer: 'False',
      explanation: 'This is a common misconception. The Great Wall is not visible from space with the naked eye due to its width.',
    },
    {
      id: '5',
      question: 'Photosynthesis is the process by which plants convert sunlight into chemical energy.',
      type: 'truefalse' as const,
      correctAnswer: 'True',
      explanation: 'Photosynthesis is indeed the process where plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
    },
  ],
  shortanswer: [
    {
      id: '6',
      question: 'What is the SI unit of force?',
      type: 'shortanswer' as const,
      correctAnswer: 'Newton',
      explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton.',
    },
    {
      id: '7',
      question: 'Who wrote Romeo and Juliet?',
      type: 'shortanswer' as const,
      correctAnswer: 'William Shakespeare',
      explanation: 'William Shakespeare wrote Romeo and Juliet, one of his most famous tragedies.',
    },
  ],
};

const CreateQuiz = ({ onCreateQuiz }: CreateQuizProps) => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionType, setQuestionType] = useState<'mixed' | 'mcq' | 'truefalse' | 'shortanswer'>('mixed');
  const [numQuestions, setNumQuestions] = useState('5');
  const [loading, setLoading] = useState(false);

  const generateQuestions = (): Question[] => {
    const num = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 20);
    const questions: Question[] = [];

    if (questionType === 'mixed') {
      const perType = Math.ceil(num / 3);
      questions.push(...SAMPLE_QUESTIONS.mcq.slice(0, perType));
      questions.push(...SAMPLE_QUESTIONS.truefalse.slice(0, perType));
      questions.push(...SAMPLE_QUESTIONS.shortanswer.slice(0, perType));
    } else if (questionType === 'mcq') {
      questions.push(...SAMPLE_QUESTIONS.mcq);
    } else if (questionType === 'truefalse') {
      questions.push(...SAMPLE_QUESTIONS.truefalse);
    } else {
      questions.push(...SAMPLE_QUESTIONS.shortanswer);
    }

    return questions.slice(0, num).map((q, i) => ({ ...q, id: String(i) }));
  };

  const handleGenerate = async () => {
    if (!topic.trim() && !notes.trim()) {
      toast.error('Please enter a topic or paste your notes');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);

    const questions = generateQuestions();
    onCreateQuiz({
      topic: topic || 'Study Quiz',
      notes,
      difficulty,
      questionType,
      numQuestions: parseInt(numQuestions) || 5,
      questions,
    });
    toast.success('Quiz generated! Start answering questions.');
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white dark:bg-slate-800 border-0 shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Create Your Quiz</h2>
        <p className="text-muted-foreground mb-8">Enter a topic or paste your study notes to generate AI-powered questions</p>

        <div className="space-y-6">
          {/* Topic Input */}
          <div>
            <Label className="text-base font-semibold mb-2 block">Topic or Subject</Label>
            <Input
              placeholder="e.g., Biology Chapter 5 - Photosynthesis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {/* Notes Textarea */}
          <div>
            <Label className="text-base font-semibold mb-2 block">Study Notes (Optional)</Label>
            <Textarea
              placeholder="Paste your study notes, textbook excerpts, or any relevant material here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-32 text-base resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {notes.length} characters
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Difficulty */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Difficulty Level</Label>
              <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy" className="font-normal cursor-pointer">Easy</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal cursor-pointer">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard" className="font-normal cursor-pointer">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question Type */}
            <div>
              <Label htmlFor="type" className="text-base font-semibold mb-2 block">Question Type</Label>
              <Select value={questionType} onValueChange={(v) => setQuestionType(v as any)}>
                <SelectTrigger id="type" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Questions</SelectItem>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="truefalse">True/False</SelectItem>
                  <SelectItem value="shortanswer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Questions */}
            <div>
              <Label htmlFor="num" className="text-base font-semibold mb-2 block">Number of Questions</Label>
              <Select value={numQuestions} onValueChange={setNumQuestions}>
                <SelectTrigger id="num" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} Questions</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading}
            size="lg"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Quiz
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📚 Multiple Formats</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">MCQ, True/False, and Short Answer questions</p>
        </Card>
        <Card className="p-4 bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">⚡ Smart Difficulty</h3>
          <p className="text-sm text-indigo-800 dark:text-indigo-200">Choose Easy, Medium, or Hard questions</p>
        </Card>
        <Card className="p-4 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">💡 Instant Feedback</h3>
          <p className="text-sm text-purple-800 dark:text-purple-200">Get explanations for every answer</p>
        </Card>
      </div>
    </div>
  );
};

export default CreateQuiz;
