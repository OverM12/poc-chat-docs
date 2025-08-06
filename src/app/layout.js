import "./globals.css";

export const metadata = {
  title: 'บริการประชาชน กรุงเทพมหานคร',
  description: 'ระบบแชทบอทสำหรับบริการประชาชนกรุงเทพมหานคร',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}