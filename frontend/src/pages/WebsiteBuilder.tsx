import React, { useState } from 'react';
import { ArrowLeft, Play, Code, Download, Laptop, Loader2, Sparkles, Layout } from 'lucide-react';
import { ThinkingTerminal, type LogStep } from '../components/agent/ThinkingTerminal';
import { agentService } from '../services/agentService';

interface WebsiteBuilderProps {
    onBack: () => void;
}

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ onBack }) => {
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState('modern');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<LogStep[]>([]);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    const addLog = (message: string, type: LogStep['type'] = 'info') => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            message,
            type,
            timestamp: Date.now()
        }]);
    };

    const handleGenerate = async () => {
        if (!description) {
            alert('Please enter a website description');
            return;
        }

        setLoading(true);
        setLogs([]);
        setGeneratedCode(null);

        try {
            addLog("Initializing Website Builder Agent...", 'info');
            await new Promise(r => setTimeout(r, 600));

            addLog("Analyzing requirements and style...", 'analysis');
            await new Promise(r => setTimeout(r, 800));

            addLog("Drafting layout structure...", 'tool');

            const prompt = `
        CRITICAL INSTRUCTION: You are an expert web developer. 
        Create a COMPLETE, SINGLE-FILE HTML website based on this description: "${description}"
        Style: ${style}
        
        Requirements:
        1. VALID HTML5 structure with <!DOCTYPE html>
        2. Embedded CSS in <style> tags (Use CSS Variables, Flexbox, Grid)
        3. Embedded JS in <script> tags (if interactive elements are needed)
        4. Modern, responsive, and aesthetically pleasing design.
        5. NO external file references (images can be placeholders or unsplash source URLs).
        
        Return ONLY the raw HTML code block. Do not include markdown formatting like \`\`\`html at the start or end if possible, or I will strip it.
      `;

            // Call the AI
            const response = await agentService.executeAdHoc(prompt);

            addLog("Generative AI synthesis complete.", 'success');
            await new Promise(r => setTimeout(r, 500));

            let output = response.data.output;

            if (typeof output !== 'string') {
                output = JSON.stringify(output);
            }

            // Cleanup markdown if present
            const codeMatch = output.match(/```html([\s\S]*?)```/) || output.match(/```([\s\S]*?)```/);
            if (codeMatch && codeMatch[1]) {
                output = codeMatch[1].trim();
            } else {
                output = output.replace(/```html/g, '').replace(/```/g, '').trim();
            }

            setGeneratedCode(output);
            addLog("Website ready for preview!", 'success');

        } catch (error: any) {
            console.error(error);
            addLog(`Generation failed: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadCode = () => {
        if (!generatedCode) return;
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                            <Laptop className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Website Builder</h1>
                            <p className="text-xs text-slate-400">One-Click AI Generator</p>
                        </div>
                    </div>
                </div>

                {generatedCode && (
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-800 p-1 rounded-lg flex border border-white/5">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Layout className="w-4 h-4 inline-block mr-2" />
                                Preview
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Code className="w-4 h-4 inline-block mr-2" />
                                Code
                            </button>
                        </div>
                        <button
                            onClick={downloadCode}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export HTML
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* Left Sidebar: Configuration */}
                <div className="w-[400px] border-r border-white/10 bg-slate-900/50 flex flex-col overflow-y-auto">
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your dream website (e.g., 'A futuristic portfolio for a 3D artist with dark mode and neon accents')"
                                className="w-full h-40 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Visual Style</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Modern', 'Minimalist', 'Retro', 'Corporate'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s.toLowerCase())}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${style === s.toLowerCase()
                                                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                                : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !description}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? 'Generating...' : 'Generate Website'}
                        </button>
                    </div>

                    <div className="flex-1 p-6 border-t border-white/10 bg-black/20">
                        <ThinkingTerminal logs={logs} isVisible={logs.length > 0} />
                    </div>
                </div>

                {/* Right Area: Preview/Code */}
                <div className="flex-1 bg-slate-950 relative">
                    {!generatedCode && !loading && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-4">
                            <Laptop className="w-16 h-16 opacity-20" />
                            <p>Your generated website will appear here</p>
                        </div>
                    )}

                    {generatedCode && (
                        <div className="w-full h-full">
                            {activeTab === 'preview' ? (
                                <iframe
                                    srcDoc={generatedCode}
                                    className="w-full h-full bg-white border-none"
                                    title="Preview"
                                    sandbox="allow-scripts"
                                />
                            ) : (
                                <pre className="w-full h-full overflow-auto p-4 text-xs font-mono text-green-400 bg-black select-all">
                                    {generatedCode}
                                </pre>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
