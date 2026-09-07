import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Quiz, Question } from '@/pages/Index';

interface TakeQuizProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
}

const TakeQuiz = ({
  quiz,
  currentQuestionIndex,
  onAnswer,
  onNext,
  onPrevious,
  onBack,
}: TakeQuizProps) => {
  const question = quiz.questions[currentQuestionIndex];
  const currentAnswer = quiz.userAnswers[currentQuestionIndex] || '';
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const isAnswered = currentAnswer.trim() !== '';
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{quiz.topic}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}% Complete</p>
      </div>

      {/* Question Card */}
      <Card className="p-8 bg-white dark:bg-slate-800 border-0 shadow-lg">
        {/* Question Type Badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
            {question.type === 'mcq' && 'Multiple Choice'}
            {question.type === 'truefalse' && 'True/False'}
            {question.type === 'shortanswer' && 'Short Answer'}
          </span>
          <span className="text-xs text-muted-foreground">
            Difficulty: <span className="font-semibold capitalize">{quiz.difficulty}</span>
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-2xl font-bold text-foreground mb-8 leading-relaxed">
          {question.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-4">
          {question.type === 'mcq' && question.options && (
            <RadioGroup value={currentAnswer} onValueChange={onAnswer}>
              {question.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'truefalse' && (
            <RadioGroup value={currentAnswer} onValueChange={onAnswer}>
              {['True', 'False'].map((option) => (
                <div key={option} className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <RadioGroupItem value={option} id={`tf-${option}`} />
                  <Label htmlFor={`tf-${option}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'shortanswer' && (
            <Input
              type="text"
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => onAnswer(e.target.value)}
              className="h-12 text-base"
            />
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <Button
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!isAnswered}
          size="lg"
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          {isLastQuestion ? (
            <>
              Finish Quiz
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Question Indicators */}
      <div className="flex flex-wrap gap-2 justify-center pt-4">
        {quiz.questions.map((_, idx) => (
          <div
            key={idx}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              idx === currentQuestionIndex
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : quiz.userAnswers[idx]
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TakeQuiz;
