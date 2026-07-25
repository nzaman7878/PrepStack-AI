import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPracticeQuiz } from '../lib/api';
import { useParams, Link } from 'react-router';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export default function Practice() {
  const { trackSlug, topicSlug } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const { data: quiz, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['practiceQuiz', topicSlug],
    queryFn: () => getPracticeQuiz(topicSlug),
    refetchOnWindowFocus: false
  });

  if (isLoading || isRefetching) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium">Loading practice quiz...</p>
      </div>
    );
  }

  if (error || !quiz || !quiz.questions) {
    const isNotFound = error?.response?.status === 404;
    return (
      <div className="mx-auto mt-12 max-w-4xl rounded-xl bg-slate-50 p-6 text-slate-600 border border-slate-200">
        <div className="flex items-start gap-4">
          <AlertCircle className={`h-6 w-6 flex-shrink-0 ${isNotFound ? 'text-slate-400' : 'text-red-500'}`} />
          <div>
            <h3 className={`font-bold text-lg ${isNotFound ? 'text-slate-700' : 'text-red-600'}`}>
              {isNotFound ? 'Practice Quiz Not Available' : 'Failed to load quiz'}
            </h3>
            <p className="mt-1">
              {isNotFound 
                ? 'This practice quiz is currently being prepared and will be published soon. Please check back later.' 
                : (error?.message || 'An unknown error occurred.')}
            </p>
            {!isNotFound && (
              <button onClick={() => refetch()} className="mt-4 inline-flex items-center text-sm font-semibold text-red-700 hover:text-red-800">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </button>
            )}
            <Link to={`/tracks/${trackSlug}/${topicSlug}`} className="mt-4 block text-sm text-blue-600 hover:underline">
              &larr; Back to topic
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isComplete = currentQuestionIndex >= quiz.questions.length;
  
  if (isComplete) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Quiz Completed!</h2>
        <p className="text-xl text-slate-600 mb-8">
          You scored <span className="font-bold text-blue-600">{score}</span> out of {quiz.questions.length}.
        </p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setSelectedOption(null);
              setIsAnswered(false);
            }} 
            className="rounded-lg bg-slate-100 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Retake Quiz
          </button>
          <Link 
            to={`/tracks/${trackSlug}/${topicSlug}`}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Review Topic
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQ.correctOptionIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/tracks/${trackSlug}/${topicSlug}`} className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Topic
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{quiz.title || 'Practice Quiz'}</h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-100 mb-8 overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300" 
          style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-8 leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left rounded-xl border p-4 transition-all duration-200 ";
            let icon = null;
            
            if (!isAnswered) {
              btnClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
            } else {
              if (idx === currentQ.correctOptionIndex) {
                btnClass += "border-green-500 bg-green-50 text-green-900";
                icon = <CheckCircle className="h-5 w-5 text-green-600" />;
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-900";
                icon = <XCircle className="h-5 w-5 text-red-600" />;
              } else {
                btnClass += "border-slate-200 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="mr-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </span>
                  {icon}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
            <div className={`rounded-xl p-4 ${selectedOption === currentQ.correctOptionIndex ? 'bg-green-50' : 'bg-red-50'}`}>
              <h4 className={`font-bold ${selectedOption === currentQ.correctOptionIndex ? 'text-green-800' : 'text-red-800'}`}>
                {selectedOption === currentQ.correctOptionIndex ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className={`mt-1 ${selectedOption === currentQ.correctOptionIndex ? 'text-green-700' : 'text-red-700'}`}>
                {currentQ.explanation}
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
