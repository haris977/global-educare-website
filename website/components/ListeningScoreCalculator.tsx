"use client";

interface ListeningScoreCalculatorProps {
  totalQuestions: number;
  correctAnswers: number;
  onScoreUpdate?: (score: number, band: string) => void;
}

export default function ListeningScoreCalculator({
  totalQuestions,
  correctAnswers,
  onScoreUpdate
}: ListeningScoreCalculatorProps) {
  // Calculate raw score percentage
  const rawScore = (correctAnswers / totalQuestions) * 100;

  // Convert raw score to IELTS band score
  const calculateBandScore = (rawScore: number): string => {
    if (rawScore >= 39) return '9.0';
    if (rawScore >= 37) return '8.5';
    if (rawScore >= 35) return '8.0';
    if (rawScore >= 32) return '7.5';
    if (rawScore >= 30) return '7.0';
    if (rawScore >= 26) return '6.5';
    if (rawScore >= 23) return '6.0';
    if (rawScore >= 18) return '5.5';
    if (rawScore >= 16) return '5.0';
    if (rawScore >= 13) return '4.5';
    if (rawScore >= 10) return '4.0';
    if (rawScore >= 7) return '3.5';
    if (rawScore >= 5) return '3.0';
    return '2.5';
  };

  const bandScore = calculateBandScore(rawScore);

  // Notify parent component of score update
  if (onScoreUpdate) {
    onScoreUpdate(rawScore, bandScore);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Test Results</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Raw Score</div>
          <div className="text-2xl font-bold text-gray-900">
            {rawScore.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            {correctAnswers} out of {totalQuestions} correct
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">IELTS Band Score</div>
          <div className="text-2xl font-bold text-blue-900">
            {bandScore}
          </div>
          <div className="text-sm text-blue-600">
            {getBandDescription(bandScore)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get band score description
function getBandDescription(band: string): string {
  const descriptions: { [key: string]: string } = {
    '9.0': 'Expert user',
    '8.5': 'Very good user',
    '8.0': 'Very good user',
    '7.5': 'Good user',
    '7.0': 'Good user',
    '6.5': 'Competent user',
    '6.0': 'Competent user',
    '5.5': 'Modest user',
    '5.0': 'Modest user',
    '4.5': 'Limited user',
    '4.0': 'Limited user',
    '3.5': 'Extremely limited user',
    '3.0': 'Extremely limited user',
    '2.5': 'Intermittent user'
  };
  
  return descriptions[band] || 'Score not available';
} 