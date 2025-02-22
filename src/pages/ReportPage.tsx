import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../components/ui/table";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

export const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            position: 'right' as const,
            labels: {
                color: '#fff', // Cor das legendas
                font: {
                    size: 12,
                },
            },
        },
        tooltip: {
            enabled: true,
            bodyColor: '#fff', // Cor do texto do tooltip
            backgroundColor: '#000', // Cor de fundo do tooltip
            borderColor: '#6366f1',
            borderWidth: 1,
            padding: 12,
            callbacks: {
                label: (context: any) => {
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const porcentagem = total > 0 ? (context.dataset.data[context.dataIndex] / total) * 100 : 0;
                    return `R$ ${value.toFixed(2)} | ${porcentagem.toFixed(2)}%`;
                },
            },
        },
    },
    layout: {
        padding: 20,
    },
};

export const optionsLine = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'top' as const,
        },
        title: {
            display: false,
            text: 'Chart.js Line Chart',
        },
    },
};

export default function ReportPage() {
    // Interface para os dados do gráfico (Doughnut)
    interface ChartData {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor?: string[];
            borderColor?: string[];
            borderWidth?: number;
            fill?: boolean;
        }[];
    }

    // Estados para o gráfico Doughnut
    const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
    const [chartDataLine, setChartDataLine] = useState<ChartData>({ labels: [], datasets: [] });
    const [valor, setValor] = useState<number[]>([]);
    const [valorMes, setValorMes] = useState<number[]>([]);
    const [estabelecimento, setEstabelecimento] = useState<string[]>([]);
    const [backgroundColor, setBackgroundColor] = useState<string[]>([]);
    const [borderColor, setBorderColor] = useState<string[]>([]);
    const [month, setMonth] = useState<string[]>([]);
    const [thisMonth, setThisMonth] = useState<number>(0);

    const tranformMonth = (month: number) => {
        switch (month) {
            case 1:
                return 'Jan';
            case 2:
                return 'Fev';
            case 3:
                return 'Mar';
            case 4:
                return 'Abr';
            case 5:
                return 'Mai';
            case 6:
                return 'Jun';
            case 7:
                return 'Jul';
            case 8:
                return 'Ago';
            case 9:
                return 'Set';
            case 10:
                return 'Out';
            case 11:
                return 'Nov';
            case 12:
                return 'Dez';
            default:
                return '';
        }
    }

    // Novo estado para armazenar os dados brutos do JSON e preencher a tabela
    const [tableData, setTableData] = useState<any[]>([]);

    const dataMonth = window.location.href.split('q=').pop();
    const card = dataMonth?.split('_')[0];

    useEffect(() => {
        fetch(`/data/${dataMonth}_2024.json`)
            .then(response => response.json())
            .then((json) => {
                // Armazena os dados completos para uso na tabela
                setTableData(json);

                // Agrupamento para o gráfico Doughnut
                const agrupado: Record<string, number> = {};
                json.forEach((item: any) => {
                    if (!agrupado[item.estabelecimento]) {
                        agrupado[item.estabelecimento] = 0;
                    }
                    agrupado[item.estabelecimento] += item.valor;
                });

                const estabelecimentos = Object.keys(agrupado);
                const valores = Object.values(agrupado);
                setEstabelecimento(estabelecimentos);
                setValor(valores);

                const novasCoresFundo = json.map((item: any) => item.bg);
                const novasCoresBorda = json.map((item: any) => item.border);
                setBackgroundColor(novasCoresFundo);
                setBorderColor(novasCoresBorda);

                const mes = json.map((item: any) => tranformMonth(item.mes))[0];
                setThisMonth(mes);
            });
        fetch(`/data/all_${card}.json`)
            .then(response => response.json())
            .then((json) => {
                const meses = json.map((item: any) => tranformMonth(item.mes));
                setMonth(meses);
                
                //somar valores por mes
                const agrupado: Record<string, number> = {};
                json.forEach((item: any) => {
                    if (!agrupado[item.mes]) {
                        agrupado[item.mes] = 0;
                    }
                    agrupado[item.mes] += item.valor;''
                });
                const valores = Object.values(agrupado);
                setValorMes(valores);
            });
    }, []);

    useEffect(() => {
        const valorPlaceholder = valor.map((item) => item < 0 ? 0 : item);
        setChartData({
            labels: estabelecimento,
            datasets: [
                {
                    label: 'Estabelecimentos',
                    data: valorPlaceholder,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                },
            ],
        });
        setChartDataLine({
            labels: month.filter((value, index, self) => self.indexOf(value) === index),
            datasets: [
                {
                    fill: true,
                    label: 'Valor Total',
                    data: valorMes, 
                    borderColor: ['rgb(232,17,75)'],
                    backgroundColor: ['rgba(232,17,75, 0.3)'],
                },
            ],
        })
    }, [valor, estabelecimento, backgroundColor, borderColor]);

    return (
        <div className="bg-zinc-900 text-white h-screen flex flex-col items-center pt-8 gap-12">
            <header className="flex flex-col justify-between items-center gap-2">
                <h1 className="text-3xl">Relatório - {thisMonth}</h1>
            </header>
            <div className="flex flex-wrap justify-evenly h-72 w-full">
                <Line data={chartDataLine} options={optionsLine} />
                <Doughnut data={chartData} options={options} height={300} />
                <div className="mt-6 w-full max-w-4xl mx-auto">
                    <div className="max-h-[300px] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Estabelecimento</TableHead>
                                    <TableHead>Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{(new Date(item.data)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                                        <TableCell>{item.estabelecimento}</TableCell>
                                        <TableCell>R$ {(item.valor).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </div>
                </div>
                <TableFooter className='bg-zinc-900 z-10 mt-6 w-full max-w-4xl mx-auto absolute bottom-0'>
                    <TableRow className='flex justify-between'>
                        <TableCell>Total</TableCell>
                        <TableCell>
                            R$ {valor.reduce((acc, cur) => acc + cur, 0).toFixed(2)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </div>
        </div>
    );
}
