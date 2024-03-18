// layout.jsx
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body className="bg-brand-dark h-full w-full text-brand-primary">
        <Navbar />
        <main className="max-w-screen-xl mx-auto py-5 bg-text-white min-h-screen overflow-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
