const Outer = ({ children, className }) => {
	return (
		<div className={`w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${className || ''}`}>
			{children}
		</div>
	)
}

export default Outer;