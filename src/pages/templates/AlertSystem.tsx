
import React, { useState } from 'react';
import { ArrowLeft, Play, Loader2, Zap } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';
import { agentService } from '../../services/agentService';

interface AlertSystemProps {
    onBack: () => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ onBack }) => {
    const [condition, setCondition] = useState('');
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
            if (!condition) throw new Error('Please enter a condition');

            addLog("Initializing Alert System...", 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog(`Setting up watchers for: ${condition}`, 'tool');
            await new Promise(r => setTimeout(r, 800));

            addLog("Monitoring stream...", 'analysis');

            const prompt = `Execute the agent task: Alert System.\nDescription: Monitor conditions and send instant notifications.\n\nInputs:\n- Condition: ${condition}`;
            const response = await agentService.executeAdHoc(prompt);

            const rawOutput = response.data.output;
            const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

            setResult({
                status: 'success',
                message: 'Alert configured successfully!',
                data: { output: finalOutput, timestamp: new Date().toISOString() }
            });
            addLog("Alert active.", 'success');

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
                        <div className="p-2 rounded-lg bg-orange-500/20">
                            <Zap className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Alert System</h1>
                            <p className="text-sm text-slate-400">Monitoring</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Configure Agent</h2>
                            <p className="text-gray-400 mb-8">Monitor conditions and send instant notifications.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Alert Condition <span className="text-pink-500">*</span></label>
                                    <textarea
                                        rows={4}
                                        placeholder="If stock price > 150"
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600"
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Activating...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Set Alert
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
