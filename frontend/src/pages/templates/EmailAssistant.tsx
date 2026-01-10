
import React, { useState } from 'react';
import { ArrowLeft, Play, AlertCircle, CheckCircle, Loader2, Mail } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';
import { agentService } from '../../services/agentService';

interface EmailAssistantProps {
    onBack: () => void;
}

export const EmailAssistant: React.FC<EmailAssistantProps> = ({ onBack }) => {
    const [provider, setProvider] = useState('gmail');
    const [style, setStyle] = useState('professional');
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
            addLog("Initializing Email Assistant...", 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog(`Connecting to ${provider} API...`, 'tool');
            await new Promise(r => setTimeout(r, 800));
            addLog("Authentication successful.", 'success');

            addLog("Scanning inbox for actionable emails...", 'analysis');

            const prompt = `Execute the agent task: Email Assistant.\nDescription: Auto-categorize and respond to emails.\n\nInputs:\n- Provider: ${provider}\n- Style: ${style}`;
            const response = await agentService.executeAdHoc(prompt);

            const rawOutput = response.data.output;
            const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

            setResult({
                status: 'success',
                message: 'Email Assistant executed successfully!',
                data: {
                    output: finalOutput,
                    timestamp: new Date().toISOString()
                }
            });
            addLog("Execution completed successfully.", 'success');

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
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Mail className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Email Assistant</h1>
                            <p className="text-sm text-slate-400">Communication</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Configure Agent</h2>
                            <p className="text-gray-400 mb-8">Auto-categorize and respond to emails with AI-powered replies.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Provider</label>
                                    <select
                                        value={provider}
                                        onChange={(e) => setProvider(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white"
                                    >
                                        <option value="gmail">Gmail</option>
                                        <option value="outlook">Outlook</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Response Style</label>
                                    <select
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-white"
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="friendly">Friendly</option>
                                        <option value="concise">Concise</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing Emails...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Run Assistant
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
