import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Trash2, Calendar, BarChart3 } from 'lucide-react';
import { Quiz } from '@/pages/Index';

interface QuizHistoryProps {
  quizzes: Quiz[];
  onSelectQuiz: (quiz: Quiz) => void;
}

const QuizHistory = ({ quizzes, onSelectQuiz }: QuizHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = quizzes.filter(q =>
    q.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200';
      case 'medium':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="p-4 bg-white dark:bg-slate-800 border-0 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search quizzes by topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </Card>

      {/* Quiz List */}
      <div className="space-y-3">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => {
            const percentage = quiz.completed ? Math.round((quiz.score / quiz.questions.length) * 100) : 0;
            const formattedDate = new Date(quiz.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Card
                key={quiz.id}
                className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {quiz.topic}
                      </h3>
                      <Badge variant="secondary" className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {quiz.questions.length} Questions
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                      </div>
                      {quiz.completed && (
                        <div className={`flex items-center gap-1 font-semibold ${getScoreColor(percentage)}`}>
                          {percentage}% Score
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    {quiz.completed && (
                      <div className="text-right hidden sm:block">
                        <p className="text-2xl font-bold text-foreground">{quiz.score}</p>
                        <p className="text-xs text-muted-foreground">of {quiz.questions.length}</p>
                      </div>
                    )}
                    <Button
                      onClick={() => onSelectQuiz(quiz)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">
                        {quiz.completed ? 'Review' : 'Continue'}
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 bg-white dark:bg-slate-800 border-0 shadow-md text-center">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'No quizzes found' : 'No quiz history yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try a different search term'
                : 'Create and complete quizzes to see them here'}
            </p>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      {quizzes.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-0 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Quizzes</p>
              <p className="text-2xl font-bold text-foreground">{quizzes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {quizzes.filter(q => q.completed).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-2xl font-bold text-foreground">
                {quizzes.filter(q => !q.completed).length}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuizHistory;
