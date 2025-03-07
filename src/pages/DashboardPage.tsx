import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"

import latamLogo from '../assets/latam_logo.svg'
import { useNavigate } from "react-router"

export default function DashboardPage() {

    const navigate = useNavigate()

    return (
        <div className="bg-zinc-900 text-white h-screen flex flex-col items-center pt-8 gap-12">
            <header className="flex flex-col justify-between items-center gap-2">
                <h1 className="text-3xl">Faturas</h1>
                <div className="flex gap-2">
                    <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white">2024</Button>
                    <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white">2025</Button>
                </div>
            </header>
            <div className="flex flex-wrap gap-6 h-72">
                {/* LATAM Card */}
                <Card className="w-[300px] p-6 bg-[#E8114B] text-white border-0">
                    <div className="h-12 mb-6">
                        <img src={latamLogo} alt="LATAM" style={{ transform: "scale(1.5)", margin: "auto" }} />
                    </div>
                    <div className="flex flex-col gap-3 items-center">
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=latam_08')}>
                            Agosto
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=latam_09')}>
                            Setembro
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=latam_10')}>
                            Outubro
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=latam_11')}>
                            Novembro
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=latam_12')}>
                            Dezembro
                        </Button>
                    </div>
                </Card>

                {/* Azul Card */}
                <Card className="w-[300px] p-6 bg-[#026CB6] text-white border-0">
                    <div className="h-12 mb-6">
                        <img src="https://www.voeazul.com.br/content/dam/azul/voe-azul/institucional/logo-azul-branco.svg" alt="Azul" className="m-auto" />
                    </div>
                    <div className="flex flex-col gap-3 items-center">
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=azul_08')}>
                            Agosto
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=azul_09')}>
                            Setembro
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=azul_10')}>
                            Outubro
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=azul_11')}>
                            Novembro
                        </Button>
                        <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-white w-[160px]" onClick={() => navigate('/report?q=azul_12')}>
                            Dezembro
                        </Button>
                    </div>
                </Card>
            </div>

        </div>
    )
}