import React from 'react'

import './styles.css'

// The template's page reads auth outside <Suspense>, which fails `next build` under
// Cache Components. Replaced with a static page; unrelated to the repro.
const HomePage = () => (
  <div className="home">
    <div className="content">
      <a className="admin" href="/admin">
        Go to admin panel
      </a>
    </div>
  </div>
)

export default HomePage
