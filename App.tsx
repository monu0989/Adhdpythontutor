
import React, { useState, useEffect, useCallback } from 'react';
import { Chapter, LessonTopic, CompletedTopics } from './types';
import { LESSON_CHAPTERS } from './constants';
import ChapterNavigation from './components/ChapterNavigation';
import LessonView from './components/LessonView';
import ProgressBar from './components/ProgressBar';
import GeminiInteraction from './components/GeminiInteraction';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>(LESSON_CHAPTERS);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(0);
  const [completedTopics, setCompletedTopics] = useState<CompletedTopics>(() => {
    const savedProgress = localStorage.getItem('pythonTutorProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  const totalTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;

  useEffect(() => {
    localStorage.setItem('pythonTutorProgress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const handleSelectTopic = useCallback((chapterIdx: number, topicIdx: number) => {
    setCurrentChapterIndex(chapterIdx);
    setCurrentTopicIndex(topicIdx);
  }, []);

  const handleToggleComplete = useCallback((topicId: string) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  }, []);

  const currentTopic: LessonTopic | undefined = chapters[currentChapterIndex]?.topics[currentTopicIndex];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100">
      <header className="p-4 shadow-lg bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-sky-400" />
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
              ADHD Python Tutor
            </h1>
          </div>
          <div className="w-1/3">
            <ProgressBar current={completedCount} total={totalTopics} />
          </div>
        </div>
      </header>

      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/3 lg:w-1/4 sticky top-20 self-start max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
          <ChapterNavigation 
            chapters={chapters} 
            currentChapterIndex={currentChapterIndex}
            currentTopicIndex={currentTopicIndex}
            onSelectTopic={handleSelectTopic}
            completedTopics={completedTopics}
          />
        </aside>

        <main className="w-full md:w-2/3 lg:w-3/4 flex-grow flex flex-col gap-6">
          {currentTopic ? (
            <>
              <LessonView 
                topic={currentTopic} 
                onToggleComplete={handleToggleComplete}
                isCompleted={!!completedTopics[currentTopic.id]}
              />
              <GeminiInteraction currentTopic={currentTopic} />
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-xl text-slate-400">Select a topic to get started!</p>
            </div>
          )}
        </main>
      </div>
       <footer className="text-center p-4 text-sm text-slate-500 border-t border-slate-700 mt-auto">
        Learn Python, one focused step at a time.
      </footer>
    </div>
  );
};

export default App;
