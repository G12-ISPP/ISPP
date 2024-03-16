import { expect, test } from 'vitest'
import { render, screen } from "@testing-library/react";
import Footer from '../components/Footer/Footer';
import '@testing-library/jest-dom'

test('renders footer without crashing', () => {
  render(<Footer />)
})

test('contains expected texts', () => {
  render(<Footer />)

  const links = screen.getAllByRole('link')
  expect(links.length).toBe(6)

  expect(links[0].textContent).toBe('Seguimiento de pedidos')
  expect(links[1].textContent).toBe('Sobre nosotros')
  expect(links[2].textContent).toBe('Contacto')
  expect(links[3].textContent).toBe('Política de privacidad')
  expect(links[4].textContent).toBe('Términos y condiciones')
  expect(links[5].textContent).toBe('Política de cookies')

  const images = screen.getAllByRole('img')
  expect(images.length).toBe(4)

  expect(images[0].src).toContain('logo.png')
  expect(images[1].src).toContain('bxl-facebook-circle.svg')
  expect(images[2].src).toContain('bxl-instagram.svg')
  expect(images[3].src).toContain('bxl-twitter.svg')

})