import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMockInterviewQuestion, evaluateInterviewAnswer } from '../lib/api';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Send, User, Bot, AlertCircle, Play } from 'lucide-react';

export default function Interview() {
  const { trackSlug } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mockInterview', trackSlug],
    queryFn: () => getMockInterviewQuestion(trackSlug),
    enabled: false // Only fetch when started
  });

  const evaluationMutation = useMutation({
    mutationFn: evaluateInterviewAnswer,
    onSuccess: (data) => {
      const evaluation = data.evaluation;
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'ai',
          type: 'evaluation',
          text: evaluation.feedback,
          score: evaluation.score,
          strengths: evaluation.strengths,
          areasForImprovement: evaluation.areasForImprovement
        },
        {
          id: Date.now() + 1,
          sender: 'ai',
          type: 'system',
          text: 'Would you like another question? Click the "Next Question" button below.'
        }
      ]);
    },
    onError: (err) => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', type: 'error', text: 'Sorry, I had trouble evaluating that answer. Please try again.' }
      ]);
    }
  });

  const startInterview = async () => {
    setInterviewStarted(true);
    const result = await refetch();
    if (result.data) {
      setCurrentQuestionData(result.data.questionData);
      setMessages([
        { 
          id: Date.now(), 
          sender: 'ai', 
          type: 'question', 
          text: result.data.questionData.question 
        }
      ]);
    }
  };

  const nextQuestion = async () => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'system', type: 'system', text: 'Loading next question...' }]);
    const result = await refetch();
    if (result.data) {
      setCurrentQuestionData(result.data.questionData);
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          sender: 'ai', 
          type: 'question', 
          text: result.data.questionData.question 
        }
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim() || evaluationMutation.isPending) return;

    const userMessage = { id: Date.now(), sender: 'user', type: 'answer', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (currentQuestionData) {
      evaluationMutation.mutate({
        question: currentQuestionData.question,
        candidateAnswer: userMessage.text,
        idealAnswer: currentQuestionData.idealAnswer,
        criteria: currentQuestionData.evaluationCriteria
      });
    }
  };

  if (!interviewStarted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <Link to={`/tracks/${trackSlug}`} className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Track
        </Link>
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-6">
          <Bot className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Mock Interview Mode</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Practice your technical communication skills. An AI senior engineer will ask you a question and evaluate your answer based on industry standards.
        </p>
        <button 
          onClick={startInterview}
          className="inline-flex items-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
        >
          <Play className="mr-3 h-5 w-5" />
          Start Mock Interview
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
        <div className="flex items-center">
          <Link to={`/tracks/${trackSlug}`} className="mr-4 text-slate-400 hover:text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="font-bold text-slate-900 capitalize">{trackSlug.replace('-', ' ')} Mock Interview</h2>
            <p className="text-xs text-slate-500">AI Senior Engineer</p>
          </div>
        </div>
        <button 
          onClick={nextQuestion}
          disabled={isLoading || isRefetching || evaluationMutation.isPending}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          Skip Question
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && msg.type !== 'system' && (
              <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-5 ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : msg.type === 'system'
                  ? 'bg-slate-100 text-slate-600 text-sm mx-auto rounded-full px-6 py-2'
                  : 'bg-slate-100 text-slate-800 rounded-tl-sm'
            }`}>
              {msg.type === 'evaluation' ? (
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900">Feedback</h3>
                    <span className={`font-bold rounded-full px-3 py-1 text-sm ${
                      msg.score >= 8 ? 'bg-green-100 text-green-700' :
                      msg.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Score: {msg.score}/10
                    </span>
                  </div>
                  <p className="mb-4">{msg.text}</p>
                  
                  {msg.strengths?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Strengths</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {msg.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  
                  {msg.areasForImprovement?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">To Improve</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {msg.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
            
            {msg.sender === 'user' && (
              <div className="ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
                <User className="h-6 w-6 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        
        {(isLoading || isRefetching || evaluationMutation.isPending) && (
          <div className="flex justify-start">
            <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 p-5 flex space-x-2 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-100 bg-white p-4">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your answer here... (Shift+Enter for new line)"
            className="flex-1 max-h-32 min-h-12 resize-none bg-transparent p-2 outline-none"
            disabled={evaluationMutation.isPending || isLoading || isRefetching}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || evaluationMutation.isPending || isLoading || isRefetching}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
