import Sidebar from './Sidebar';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:mr-72 min-h-screen">
        <div className="p-6 md:p-8">
          {title && (
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && <p className="opacity-60 mt-2">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}