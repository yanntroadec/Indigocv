import { render, screen, fireEvent } from '@testing-library/react'
import PhoneField from '@/components/form/PhoneField'

describe('PhoneField', () => {
  const defaultProps = {
    label: 'Téléphone',
    value: '',
    onChange: vi.fn(),
    placeholder: '612345678',
    invalidMessage: 'Numéro invalide',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with empty value', () => {
    render(<PhoneField {...defaultProps} />)
    expect(screen.getByText('Téléphone')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('612345678')
    expect(input).toHaveValue('')
  })

  it('parses +33612345678 as France with local 612345678', () => {
    render(<PhoneField {...defaultProps} value="+33612345678" />)
    // France flag and dial code should be visible
    expect(screen.getByText('🇫🇷')).toBeInTheDocument()
    expect(screen.getByText('+33')).toBeInTheDocument()
    // Local number in input
    const input = screen.getByPlaceholderText('612345678') as HTMLInputElement
    expect(input.value).toBe('612345678')
  })

  it('calls onChange with full international number when typing', () => {
    const onChange = vi.fn()
    render(<PhoneField {...defaultProps} onChange={onChange} />)

    const input = screen.getByPlaceholderText('612345678')
    fireEvent.change(input, { target: { value: '612345678' } })

    expect(onChange).toHaveBeenCalledWith('+33612345678')
  })

  it('calls onChange with empty string when input is cleared', () => {
    const onChange = vi.fn()
    render(<PhoneField {...defaultProps} value="+33612345678" onChange={onChange} />)

    const input = screen.getByPlaceholderText('612345678')
    fireEvent.change(input, { target: { value: '' } })

    expect(onChange).toHaveBeenCalledWith('')
  })

  it('shows error for invalid length', () => {
    // France expects 9 digits, 5 is invalid
    render(<PhoneField {...defaultProps} value="+3312345" />)
    expect(screen.getByText('Numéro invalide')).toBeInTheDocument()
  })

  it('does not show error for valid length', () => {
    // France expects 9 digits
    render(<PhoneField {...defaultProps} value="+33612345678" />)
    expect(screen.queryByText('Numéro invalide')).not.toBeInTheDocument()
  })
})
