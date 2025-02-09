import { StlInput } from "../components/StlInpur";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const handleClick = async () => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(navigate('/dashboard'))
                }, 2000)
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    return (
        <div className="bg-zinc-900 mx text-white">
            <div className="flex justify-center items-center h-screen">
                <div className="bg-transparent p-4 rounded-lg border border-zinc-700">
                    <h1 className="text-2xl font-bold text-center">Login</h1>
                    <div className="mt-4">
                        <StlInput
                            id="username"
                            label="Username"
                            type="text"
                            onChange={handleChange}
                            value={username}
                        />
                        <StlInput
                            id="password"
                            label="Password"
                            type="password"
                            onChange={handleChange2}
                            value={password}
                        />
                    </div>
                    {/* <div className="mt-4 w-full text-center">
                        <Button variant="secondary" className="w-20">Entrar</Button>
                    </div> */}

                    <div className="relative w-full h-10 mt-7">
                        <motion.div
                            initial={false}
                            animate={{
                                width: isLoading ? 40 : "100%",
                                height: isLoading ? 40 : 40,
                                borderRadius: isLoading ? "50%" : 6,
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                        >
                            <Button variant="secondary" onClick={handleClick} disabled={isLoading} className="w-full h-full">
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loader"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center"
                                        >
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="text"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center justify-center"
                                        >
                                            Login
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}