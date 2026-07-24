import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTopicContent, getBookmarks, toggleBookmark } from '../lib/api';
import { useParams, Link } from 'react-router';
import { ArrowLeft, BookOpen, Code, Lightbulb, Play, AlertCircle, Copy, Check, Bot, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const CodeBlock = ({ title, code, explanation }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2">
        <span className="text-sm font-medium text-slate-300">{title}</span>
        <button
          onClick={copyToClipboard}
          className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-slate-50 font-mono">
          <code>{code}</code>
        </pre>
      </div>
      {explanation && (
        <div className="border-t border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300">
          <Lightbulb className="inline-block h-4 w-4 mr-2 text-yellow-400" />
          {explanation}
        </div>
      )}
    </div>
  );
};

export default function TopicDetails() {
  const { trackSlug, topicSlug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['topicContent', topicSlug],
    queryFn: () => getTopicContent(topicSlug),
  });

  const { data: bookmarkedTopics } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
  });

  const isBookmarked = bookmarkedTopics?.some(t => t.slug === topicSlug);

  useDocumentTitle(data ? `${data.name}` : 'Topic Details');

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookmarks']);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Generating AI content for this topic...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto mt-12 max-w-4xl rounded-xl bg-red-50 p-6 text-red-600 border border-red-200 shadow-sm flex items-start gap-4">
        <AlertCircle className="h-6 w-6 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg">Failed to load content</h3>
          <p className="mt-1">{error?.message || 'An unknown error occurred.'}</p>
        </div>
      </div>
    );
  }

  const { overview, practical, interview, summary } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/tracks/${trackSlug}`} className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Track
      </Link>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl capitalize">
          {topicSlug.replace(/-/g, ' ')}
        </h1>
        <Link 
          to={`/tracks/${trackSlug}/${topicSlug}/practice`}
          className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Bot className="mr-2 h-4 w-4" />
          Practice Quiz
        </Link>
      </div>

      <div className="mb-8 flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'practical', label: 'Practical', icon: Code },
          { id: 'interview', label: 'Interview QA', icon: Lightbulb },
          { id: 'summary', label: 'Summary', icon: Play },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex whitespace-nowrap items-center border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pb-24"
      >
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">The Basics</h2>
              <p className="text-lg leading-relaxed text-slate-700">{overview.beginnerExplanation}</p>
            </section>
            
            <section className="rounded-2xl bg-blue-50 p-6 md:p-8 border border-blue-100">
              <h3 className="flex items-center text-xl font-bold text-blue-900 mb-3">
                <Lightbulb className="mr-2 h-5 w-5 text-blue-600" />
                Real-World Analogy
              </h3>
              <p className="text-blue-800 leading-relaxed text-lg italic">"{overview.realWorldAnalogy}"</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Intermediate Concepts</h2>
              <p className="text-lg leading-relaxed text-slate-700 mb-6">{overview.intermediateExplanation}</p>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">Why it exists</h3>
              <p className="text-lg leading-relaxed text-slate-700">{overview.whyItExists}</p>
            </section>

            <section className="rounded-2xl bg-slate-900 p-6 md:p-8 text-slate-50">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Advanced: Under the Hood</h2>
              <p className="text-lg leading-relaxed text-slate-300">{overview.advancedExplanation}</p>
              
              <h3 className="text-xl font-bold text-white mt-8 mb-3">Internal Workings</h3>
              <p className="text-lg leading-relaxed text-slate-300">{overview.internalWorking}</p>
            </section>
          </div>
        )}

        {activeTab === 'practical' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Use Cases</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {practical.useCases?.map((useCase, idx) => (
                  <li key={idx} className="flex items-start rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <Check className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Code Examples</h2>
              {practical.codeExamples?.map((example, idx) => (
                <CodeBlock key={idx} {...example} />
              ))}
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Best Practices</h2>
                <ul className="space-y-3">
                  {practical.bestPractices?.map((practice, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0 text-xs font-bold mt-0.5">{idx + 1}</div>
                      <span className="text-slate-700">{practice}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Common Mistakes</h2>
                <ul className="space-y-3">
                  {practical.commonMistakes?.map((mistake, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 flex-shrink-0 text-xs font-bold mt-0.5">!</div>
                      <span className="text-slate-700">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            
            {practical.performanceConsiderations && (
              <section className="rounded-2xl bg-amber-50 p-6 md:p-8 border border-amber-200">
                <h3 className="flex items-center text-xl font-bold text-amber-900 mb-3">
                  <Play className="mr-2 h-5 w-5 text-amber-600" />
                  Performance Considerations
                </h3>
                <p className="text-amber-800 leading-relaxed text-lg">{practical.performanceConsiderations}</p>
              </section>
            )}
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-8">
            {interview.questions?.map((q, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-600">
                    Q{idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{q.question}</h3>
                    <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Answer</h4>
                      <p className="text-slate-700 leading-relaxed">{q.answer}</p>
                    </div>
                    
                    {q.followUpQuestions?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Follow-up Questions</h4>
                        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                          {q.followUpQuestions.map((fq, fidx) => (
                            <li key={fidx}>{fq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="grid md:grid-cols-2 gap-8">
            <section className="rounded-2xl bg-blue-600 p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Check className="mr-2 h-6 w-6" />
                Key Takeaways
              </h2>
              <ul className="space-y-4">
                {summary.keyTakeaways?.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">•</div>
                    <span className="text-blue-50 text-lg">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Cheat Sheet</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p className="whitespace-pre-wrap">{summary.cheatSheet}</p>
              </div>
            </section>
          </div>
        )}
      </motion.div>
    </div>
  );
}
