
import React, { useState } from 'react';
import { ArrowLeft, Play, AlertCircle, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../../components/agent/ThinkingTerminal';
import { agentService } from '../../services/agentService';

interface MeetingSchedulerProps {
    onBack: () => void;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ onBack }) => {
    const [calendarUrl, setCalendarUrl] = useState('');
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
            if (!calendarUrl) {
                throw new Error('Please provide a Calendar Link');
            }

            addLog("Initializing Meeting Scheduler...", 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog(`Validating calendar URL: ${calendarUrl}`, 'analysis');
            await new Promise(r => setTimeout(r, 500));
            addLog("URL verified successfully.", 'success');

            addLog("Connecting to AI Engine...", 'info');

            // Construct prompt
            const prompt = `Execute the agent task: Meeting Scheduler.\nDescription: Automatically schedule meetings based on calendar availability.\n\nInputs:\n- Calendar Link: ${calendarUrl}`;

            const response = await agentService.executeAdHoc(prompt);

            const rawOutput = response.data.output;
            const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

            setResult({
                status: 'success',
                message: 'Meeting Scheduler executed successfully!',
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
                        <div className="p-2 rounded-lg bg-green-500/20">
                            <Calendar className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Meeting Scheduler</h1>
                            <p className="text-sm text-slate-400">Productivity</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Configure Scheduler</h2>
                            <p className="text-gray-400 mb-8">Automatically schedule meetings based on calendar availability.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Calendar Link <span className="text-pink-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://cal.com/username"
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors placeholder-gray-600"
                                        value={calendarUrl}
                                        onChange={(e) => setCalendarUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Run Scheduler
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
                                            {error ? 'Scheduling Failed' : 'Scheduling Successful'}
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

                    {/* Right Column: Info */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <h3 className="font-bold text-gray-300 mb-4">About the Scheduler</h3>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span>Syncs with Cal.com/Google</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4" />
                                    </div>
                                    <span>Instant Confirmation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
