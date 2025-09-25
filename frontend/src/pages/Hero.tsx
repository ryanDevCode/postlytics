import { Button } from "../components/ui/button"

const Hero = () => {
    return (
        <div>
            <div className="header">
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Welcome to postlytics</h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">Click the button to continue</p>
                <Button>Sign In</Button>
            </div>
        </div>
    )
}

export default Hero