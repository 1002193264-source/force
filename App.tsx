import React from 'react';
import Header from './components/Header';
import InteractiveQuiz from './components/InteractiveQuiz';
import CollaborativeProblemSolver from './components/CollaborativeProblemSolver';
import DiagramVisualizer from './components/DiagramVisualizer';
import ForceInteractionBuilder from './components/ForceInteractionBuilder';

const App: React.FC = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid gap-8 md:grid-cols-2">
          <InteractiveQuiz />
          <CollaborativeProblemSolver />
          <DiagramVisualizer />
          <ForceInteractionBuilder />
        </main>
      </div>
    </div>
  );
};

export default App;