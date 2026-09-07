import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, BarChart3, History } from 'lucide-react';
import CreateQuiz from '@/components/CreateQuiz';
import TakeQuiz from '@/components/TakeQuiz';
import Results from '@/components/Results';
import Dashboard from '@/components/Dashboard';
import QuizHistory from '@/components/QuizHistory';

interface Quiz {
  id: string;
  topic: string;
  notes: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: 'mixed' | 'mcq' | 'truefalse' | 'shortanswer';
  numQuestions: number;
  questions: Question[];
  userAnswers: (string | null)[];
  completed: boolean;
  score: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'truefalse' | 'shortanswer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleCreateQuiz = (quiz: Omit<Quiz, 'id' | 'userAnswers' | 'completed' | 'score' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      userAnswers: new Array(quiz.questions.length).fill(null),
      completed: false,
      score: 0,
      createdAt: new Date(),
    };
    setQuizzes([newQuiz, ...quizzes]);
    setCurrentQuiz(newQuiz);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setActiveTab('quiz');
  };

  const handleAnswerQuestion = (answer: string) => {
    if (currentQuiz) {
      const updatedQuiz = { ...currentQuiz };
      updatedQuiz.userAnswers[currentQuestionIndex] = answer;
      setCurrentQuiz(updatedQuiz);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeQuiz = () => {
    if (currentQuiz) {
      let score = 0;
      currentQuiz.questions.forEach((q, i) => {
        if (currentQuiz.userAnswers[i]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
          score++;
        }
      });
      const updatedQuiz = { ...currentQuiz, completed: true, score };
      setCurrentQuiz(updatedQuiz);
      setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
      setShowResults(true);
    }
  };

  const handleRetryQuiz = () => {
    if (currentQuiz) {
      const resetQuiz = {
        ...currentQuiz,
        userAnswers: new Array(currentQuiz.questions.length).fill(null),
        completed: false,
        score: 0,
      };
      setCurrentQuiz(resetQuiz);
      setCurrentQuestionIndex(0);
      setShowResults(false);
    }
  };

  const handleSelectQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setShowResults(quiz.completed);
    setActiveTab('quiz');
  };

  const handleBackToHome = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              QuizGen AI
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {quizzes.length > 0 && `${quizzes.length} Quiz${quizzes.length !== 1 ? 'zes' : ''}`}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentQuiz && !showResults ? (
          <TakeQuiz
            quiz={currentQuiz}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={handleAnswerQuestion}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            onBack={handleBackToHome}
          />
        ) : currentQuiz && showResults ? (
          <Results
            quiz={currentQuiz}
            onRetry={handleRetryQuiz}
            onBack={handleBackToHome}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <CreateQuiz onCreateQuiz={handleCreateQuiz} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard quizzes={quizzes} />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <QuizHistory quizzes={quizzes} onSelectQuiz={handleSelectQuiz} />
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card className="p-8 bg-white dark:bg-slate-800">
                <h2 className="text-2xl font-bold mb-4 text-foreground">About QuizGen AI</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    QuizGen AI is your intelligent study companion, designed to help you master any subject through interactive quizzes.
                  </p>
                  <p>
                    <strong>Features:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Generate quizzes from your study notes or topics</li>
                    <li>Multiple question types: MCQ, True/False, Short Answer</li>
                    <li>Choose difficulty level and number of questions</li>
                    <li>Get detailed explanations for every answer</li>
                    <li>Track your progress and improvement over time</li>
                    <li>Review your quiz history anytime</li>
                  </ul>
                  <p className="mt-6 pt-6 border-t border-border text-sm">
                    Start creating quizzes today and accelerate your learning journey! 🚀
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
