
import React, { useState } from 'react';
import { ArrowLeft, Play, Loader2, TrendingUp } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';
import { agentService } from '../../services/agentService';

interface SocialMonitorProps {
    onBack: () => void;
}

export const SocialMonitor: React.FC<SocialMonitorProps> = ({ onBack }) => {
    const [keywords, setKeywords] = useState('');
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
            if (!keywords) throw new Error('Please enter keywords');

            addLog("Initializing Social Monitor...", 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog(`Tracking keywords: ${keywords}`, 'tool');
            await new Promise(r => setTimeout(r, 800));

            addLog("Analyzing sentiment...", 'analysis');

            const prompt = `Execute the agent task: Social Media Monitor.\nDescription: Track mentions and sentiment across platforms.\n\nInputs:\n- Keywords: ${keywords}`;
            const response = await agentService.executeAdHoc(prompt);

            const rawOutput = response.data.output;
            const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

            setResult({
                status: 'success',
                message: 'Monitoring report generated!',
                data: { output: finalOutput, timestamp: new Date().toISOString() }
            });
            addLog("Monitoring complete.", 'success');

        } catch (err: any) {
            setError(err.message || 'Error occurred');
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
                        <div className="p-2 rounded-lg bg-pink-500/20">
                            <TrendingUp className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Social Media Monitor</h1>
                            <p className="text-sm text-slate-400">Marketing</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Configure Agent</h2>
                            <p className="text-gray-400 mb-8">Track mentions and sentiment across platforms.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Keywords to Track <span className="text-pink-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="#AI, @AgentForge"
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-600"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Monitoring...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Start Monitor
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {(loading || logs.length > 0) && <ThinkingTerminal logs={logs} isVisible={true} />}
                        {(result || error) && (
                            <div className={`rounded-xl border p-6 ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                                <h3 className={`font-bold mb-2 ${error ? 'text-red-400' : 'text-green-400'}`}>{error ? 'Failed' : 'Success'}</h3>
                                {result && <div className="text-sm whitespace-pre-wrap">{result.data.output}</div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
