
import React from 'react';

const ZanvexisLogo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12L22 7" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12V22" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const Header = () => {
    return (
        <header className="bg-zanvexis-medium shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                       <ZanvexisLogo />
                        <h1 className="text-xl md:text-2xl font-bold text-white">
                            Zanvexis Gestor de OS
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
