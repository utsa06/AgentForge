
import React, { useState } from 'react';
import { ArrowLeft, Play, AlertCircle, CheckCircle, Loader2, Globe } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';
import { agentService } from '../../services/agentService';

interface WebScraperProps {
    onBack: () => void;
}

export const WebScraper: React.FC<WebScraperProps> = ({ onBack }) => {
    const [targetUrl, setTargetUrl] = useState('');
    const [dataPoints, setDataPoints] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogStep[]>([]);

    const addLog = (message: string, type: LogStep['type'] = 'info') => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type,
            timestamp: Date.now()
        }]);
    };

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setLogs([]);

        try {
            if (!targetUrl || !dataPoints) {
                throw new Error('Please fill in all details');
            }

            addLog("Initializing Web Scraper...", 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog(`Analyzing target URL: ${targetUrl}`, 'analysis');
            await new Promise(r => setTimeout(r, 800));

            addLog("Fetching metadata and structure...", 'tool');

            const prompt = `Execute the agent task: Web Data Scraper.\nDescription: Extract data from websites.\n\nInputs:\n- Target URL: ${targetUrl}\n- Data Points: ${dataPoints}`;
            const response = await agentService.executeAdHoc(prompt);

            const rawOutput = response.data.output;
            const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

            setResult({
                status: 'success',
                message: 'Scraping completed successfully!',
                data: {
                    output: finalOutput,
                    timestamp: new Date().toISOString()
                }
            });
            addLog("Data extracted successfully.", 'success');

        } catch (err: any) {
            setError(err.message || 'An error occurred');
            addLog(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className="p-2 rounded-lg bg-purple-500/20">
                            <Globe className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Web Data Scraper</h1>
                            <p className="text-sm text-slate-400">Data Collection</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Configure Scraper</h2>
                            <p className="text-gray-400 mb-8">Extract data from websites and save to spreadsheet.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target URL <span className="text-pink-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="https://example.com/products"
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
                                        value={targetUrl}
                                        onChange={(e) => setTargetUrl(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Data to Extract <span className="text-pink-500">*</span></label>
                                    <textarea
                                        rows={4}
                                        placeholder="Product Name, Price, Rating"
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
                                        value={dataPoints}
                                        onChange={(e) => setDataPoints(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Scraping...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Start Scraping
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {(loading || logs.length > 0) && (
                            <ThinkingTerminal logs={logs} isVisible={true} />
                        )}

                        {(result || error) && (
                            <div className={`rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                                <div className="flex items-start gap-4">
                                    {error ? <AlertCircle className="w-6 h-6 text-red-400" /> : <CheckCircle className="w-6 h-6 text-green-400" />}
                                    <div className="w-full">
                                        <h3 className={`font-bold mb-2 ${error ? 'text-red-400' : 'text-green-400'}`}>
                                            {error ? 'Execution Failed' : 'Execution Successful'}
                                        </h3>
                                        {result && result.data && (
                                            <div className="bg-slate-950/50 p-6 rounded-lg text-sm leading-relaxed whitespace-pre-wrap font-sans text-gray-200 border border-white/5">
                                                {result.data.output}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
