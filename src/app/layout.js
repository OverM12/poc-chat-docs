import "./globals.css";

export const metadata = {
  title: 'บริการประชาชน กรุงเทพมหานคร',
  description: 'ระบบแชทบอทสำหรับบริการประชาชนกรุงเทพมหานคร',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}