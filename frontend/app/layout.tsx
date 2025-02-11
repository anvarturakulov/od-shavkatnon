import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Roboto } from 'next/font/google'
import './styles/globals.css'
import { AppProvider } from './context/app.context'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700'] })
const roboto = Roboto({ subsets: ['cyrillic', 'latin'], weight: ['300', '400', '500', '700'] })

export const metadata: Metadata = {
  title: 'Oson Dastur',
  description: 'App for Shavkatnon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
        <body className={roboto.className}>
          <AppProvider>
            {children}
          </AppProvider>
        </body>
      
    </html>
  )
}

