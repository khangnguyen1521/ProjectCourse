const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-gray-500 text-white',
    outline: 'border-2 border-primary-500 text-primary-500'
  }

  return (
    <button 
      className={`px-4 py-2 rounded-md ${variants[variant]} hover:opacity-90 transition-opacity`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button 
