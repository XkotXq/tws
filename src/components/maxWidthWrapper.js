const MaxWidthWrapper = ({children, className}) => {
    return (
        <div className={"max-w-5xl mx-auto w-full " + className}>
            {children}
        </div>
    )
}
export default MaxWidthWrapper