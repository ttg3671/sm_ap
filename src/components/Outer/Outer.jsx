const Outer = ({ children, className }) => {
	return (
		<div className={`w-full h-screen bg-white grid grid-cols-1 md:grid-cols-12 gap-4 ${className}`}>
			{children}
		</div>
	)
}

export default Outer;