import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Quiz } from '@/pages/Index';

interface ResultsProps {
  quiz: Quiz;
  onRetry: () => void;
  onBack: () => void;
}

const Results = ({ quiz, onRetry, onBack }: ResultsProps) => {
  const percentage = Math.round((quiz.score / quiz.questions.length) * 100);
  const correctCount = quiz.score;
  const incorrectCount = quiz.questions.length - quiz.score;

  const getPerformanceColor = (pct: number) => {
    if (pct >= 80) return 'from-green-600 to-emerald-600';
    if (pct >= 60) return 'from-blue-600 to-indigo-600';
    if (pct >= 40) return 'from-orange-600 to-amber-600';
    return 'from-red-600 to-rose-600';
  };

  const getPerformanceMessage = (pct: number) => {
    if (pct >= 90) return '🎉 Outstanding! You\'ve mastered this topic!';
    if (pct >= 80) return '👏 Excellent work! Keep it up!';
    if (pct >= 70) return '✨ Good job! A bit more practice needed.';
    if (pct >= 60) return '📚 Not bad! Review and try again.';
    if (pct >= 40) return '💪 Keep learning! Practice makes perfect.';
    return '🎯 Let\'s review and try again!';
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className={`p-8 bg-gradient-to-br ${getPerformanceColor(percentage)} text-white border-0 shadow-lg`}>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Quiz Completed!</h2>
          <div className="flex items-center justify-center">
            <div className="text-7xl font-bold">{percentage}%</div>
            <div className="ml-6 text-right">
              <p className="text-2xl font-semibold">{correctCount} Correct</p>
              <p className="text-white/80">out of {quiz.questions.length}</p>
            </div>
          </div>
          <p className="text-lg font-semibold text-white/90">{getPerformanceMessage(percentage)}</p>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-3xl font-bold text-foreground">{correctCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Incorrect Answers</p>
              <p className="text-3xl font-bold text-foreground">{incorrectCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Accuracy Rate</p>
            <Progress value={percentage} className="h-2 mb-2" />
            <p className="text-lg font-bold text-foreground">{percentage}%</p>
          </div>
        </Card>
      </div>

      {/* Detailed Review */}
      <Card className="p-8 bg-white dark:bg-slate-800 border-0 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-foreground">Answer Review</h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {quiz.questions.map((question, idx) => {
            const userAnswer = quiz.userAnswers[idx];
            const isCorrect = userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase();
            
            return (
              <div key={idx} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'}`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-2">Q{idx + 1}: {question.question}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Your answer: </span>
                        <span className={isCorrect ? 'text-green-700 dark:text-green-300 font-semibold' : 'text-red-700 dark:text-red-300 font-semibold'}>
                          {userAnswer || '(Not answered)'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="text-muted-foreground">Correct answer: </span>
                          <span className="text-green-700 dark:text-green-300 font-semibold">{question.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-muted-foreground italic mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <Button
          onClick={onRetry}
          size="lg"
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Retry Quiz
        </Button>
      </div>
    </div>
  );
};

export default Results;
