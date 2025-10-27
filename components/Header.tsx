import React from 'react';
import { PhysicsIcon } from './icons/PhysicsIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4 mb-4">
        <PhysicsIcon className="w-12 h-12 text-amber-700" />
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-700">
          مختبر الفيزياء التفاعلي
        </h1>
      </div>
      <p className="text-lg text-gray-800 max-w-3xl mx-auto">
        أدوات رقمية لتعزيز المشاركة والتفاعل في تعلم الفيزياء، مدعومة بالذكاء الاصطناعي.
      </p>
    </header>
  );
};

export default Header;