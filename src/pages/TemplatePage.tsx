import React, { useState } from 'react';
import { ArrowLeft, Play, AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { getTemplateById } from '../lib/templateRegistry';
import { ThinkingTerminal, type LogStep } from '../components/agent/ThinkingTerminal';

interface TemplatePageProps {
    templateId: string;
    onBack: () => void;
}

export const TemplatePage: React.FC<TemplatePageProps> = ({ templateId, onBack }) => {
    const template = getTemplateById(templateId);
    const [inputs, setInputs] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogStep[]>([]);

    if (!template) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Template Not Found</h1>
                    <button onClick={onBack} className="text-purple-400 hover:text-purple-300">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const Icon = template.icon;

    const handleInputChange = (id: string, value: any) => {
        setInputs(prev => ({ ...prev, [id]: value }));
    };

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
        setLogs([]); // Clear previous logs

        try {
            // Validate inputs
            const missingFields = template.inputs.filter(input => input.required && !inputs[input.id]);
            if (missingFields.length > 0) {
                throw new Error(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
            }

            // --- Simulation of Agent Execution Logs ---
            addLog(`Initializing agent: ${template.name}...`, 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog("Validating input parameters...", 'analysis');
            await new Promise(r => setTimeout(r, 500));
            addLog("Inputs verified successfully.", 'success');

            addLog("Connecting to AI Engine...", 'info');
            await new Promise(r => setTimeout(r, 800));

            addLog(`Processing request...`, 'analysis');
            await new Promise(r => setTimeout(r, 1000));

            // --- REAL BACKEND CALL ---
            addLog("Sending task to AI Brain...", 'tool');

            // Construct prompt from inputs
            let prompt = `Execute the agent task: ${template.name}.\nDescription: ${template.description}.\n\nInputs:\n`;
            Object.entries(inputs).forEach(([key, value]) => {
                prompt += `- ${key}: ${value}\n`;
            });

            // Call the ad-hoc execution endpoint
            // This will route: Frontend -> Node.js -> Python Agno
            // @ts-ignore
            const response = await import('../services/agentService').then(m => m.agentService.executeAdHoc(prompt));

            addLog("Generating response...", 'tool');

            // content is usually in response.data.output.content or just response.data.output depending on Agno structure
            // Agno usually returns a string or an object with 'content'
            const rawOutput = response.data.output;
            const finalOutput = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput, null, 2);

            const mockResponse = {
                status: 'success',
                message: `Agent ${template.name} executed successfully!`,
                data: {
                    timestamp: new Date().toISOString(),
                    output: finalOutput, // Real AI Output
                    processed_inputs: inputs
                }
            };

            setResult(mockResponse);
            addLog("Execution completed successfully.", 'success');

        } catch (err: any) {
            setError(err.message || 'An error occurred while running the agent');
            addLog(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className={`p-2 rounded-lg ${template.color} bg-opacity-20`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{template.name}</h1>
                            <p className="text-sm text-slate-400">{template.category}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Configuration */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Configure Agent</h2>
                            <p className="text-gray-400 mb-8">{template.description}</p>

                            <div className="space-y-6">
                                {template.inputs.map((input) => (
                                    <div key={input.id}>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            {input.label}
                                            {input.required && <span className="text-pink-500 ml-1">*</span>}
                                        </label>

                                        {input.type === 'select' ? (
                                            <select
                                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-white"
                                                value={inputs[input.id] || ''}
                                            >
                                                <option value="" disabled>Select an option</option>
                                                {input.options?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        ) : input.type === 'textarea' ? (
                                            <textarea
                                                rows={4}
                                                placeholder={input.placeholder}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
                                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                value={inputs[input.id] || ''}
                                            />
                                        ) : (
                                            <input
                                                type={input.type}
                                                placeholder={input.placeholder}
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
                                                onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                value={inputs[input.id] || ''}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleRun}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Running Agent...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Run Agent
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Execution Terminal */}
                        {(loading || logs.length > 0) && (
                            <ThinkingTerminal logs={logs} isVisible={true} />
                        )}

                        {/* Output Section */}
                        {(result || error) && (
                            <div className={`rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'
                                }`}>
                                <div className="flex items-start gap-4">
                                    {error ? (
                                        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                    ) : (
                                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    )}
                                    <div className="w-full">
                                        <h3 className={`font-bold mb-2 ${error ? 'text-red-400' : 'text-green-400'}`}>
                                            {error ? 'Execution Failed' : 'Execution Successful'}
                                        </h3>
                                        <p className="text-gray-300 mb-4">{error || result?.message}</p>

                                        {result && result.data && (
                                            result.data.output ? (
                                                <div className="bg-slate-950/50 p-6 rounded-lg text-sm leading-relaxed whitespace-pre-wrap font-sans text-gray-200 border border-white/5">
                                                    {result.data.output}
                                                </div>
                                            ) : (
                                                <pre className="bg-slate-950/50 p-4 rounded-lg text-xs font-mono overflow-auto max-w-full">
                                                    {JSON.stringify(result.data, null, 2)}
                                                </pre>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Info */}
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <h3 className="font-bold text-gray-300 mb-4">About this Agent</h3>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span>Automated Workflow</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4" />
                                    </div>
                                    <span>~2s Execution Time</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span>Verified Template</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
