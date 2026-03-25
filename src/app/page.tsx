import Uploader from '@/components/Uploader'

const features = [
  { icon: '⚡', title: 'Fast', desc: 'Results in seconds, powered by AI.' },
  { icon: '🆓', title: 'Free', desc: 'No sign-up required. Just upload and download.' },
  { icon: '🔒', title: 'Private', desc: 'Images processed in memory — never stored.' },
]

export default function Home() {
  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <span className="text-blue-600 font-bold text-xl">✂️ BGRemover</span>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Image Background Remover</h1>
          <p className="text-slate-500 text-lg">
            Upload a photo and remove the background instantly — free, fast, and private.
          </p>
        </section>

        <Uploader />

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="text-center py-6 text-slate-400 text-sm border-t border-slate-200">
        © 2026 BGRemover ·{' '}
        <a href="/privacy" className="hover:text-slate-600 transition-colors">
          Privacy Policy
        </a>
      </footer>
    </>
  )
}
