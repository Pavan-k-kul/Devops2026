import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders the application heading and pipeline description', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Get started with devops' }),
    ).toBeInTheDocument()
    expect(screen.getByText('My first jenkins pipeline ci/cd build')).toBeInTheDocument()
  })

  it('increments the counter when clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Count is 0' }))

    expect(screen.getByRole('button', { name: 'Count is 1' })).toBeInTheDocument()
  })
})
