import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, BookOpen, Zap } from 'lucide-react';
import { Quiz } from '@/pages/Index';

interface DashboardProps {
  quizzes: Quiz[];
}

const Dashboard = ({ quizzes }: DashboardProps) => {
  const completedQuizzes = quizzes.filter(q => q.completed);
  const totalQuestions = completedQuizzes.reduce((sum, q) => sum + q.questions.length, 0);
  const totalCorrect = completedQuizzes.reduce((sum, q) => sum + q.score, 0);
  const averageScore = completedQuizzes.length > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Prepare chart data
  const chartData = completedQuizzes.map(q => ({
    name: q.topic.length > 15 ? q.topic.substring(0, 15) + '...' : q.topic,
    score: Math.round((q.score / q.questions.length) * 100),
    questions: q.questions.length,
  }));

  const difficultyData = [
    { name: 'Easy', value: quizzes.filter(q => q.difficulty === 'easy').length },
    { name: 'Medium', value: quizzes.filter(q => q.difficulty === 'medium').length },
    { name: 'Hard', value: quizzes.filter(q => q.difficulty === 'hard').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
              <p className="text-3xl font-bold text-foreground">{completedQuizzes.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-3xl font-bold text-foreground">{averageScore}%</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
              <p className="text-3xl font-bold text-foreground">{totalQuestions}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
              <p className="text-3xl font-bold text-foreground">{totalCorrect}</p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg">
              <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Trend */}
        {chartData.length > 0 && (
          <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quiz Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Difficulty Distribution */}
        {difficultyData.length > 0 && (
          <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Difficulty Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Empty State */}
      {completedQuizzes.length === 0 && (
        <Card className="p-12 bg-white dark:bg-slate-800 border-0 shadow-md text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Quiz Data Yet</h3>
          <p className="text-muted-foreground">
            Complete some quizzes to see your performance statistics and progress tracking here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
