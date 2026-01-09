import React, { useEffect, useRef } from 'react';
import { Terminal, Cpu, Shield, Zap } from 'lucide-react';

export interface LogStep {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'analysis' | 'tool';
    timestamp: number;
}

interface ThinkingTerminalProps {
    logs: LogStep[];
    isVisible: boolean;
}

export const ThinkingTerminal: React.FC<ThinkingTerminalProps> = ({ logs, isVisible }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isVisible) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'analysis': return <Cpu className="w-3 h-3 text-purple-400" />;
            case 'tool': return <Zap className="w-3 h-3 text-yellow-400" />;
            case 'success': return <Shield className="w-3 h-3 text-green-400" />;
            default: return <Terminal className="w-3 h-3 text-slate-400" />;
        }
    };

    return (
        <div className="w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 font-mono text-sm mb-8">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-xs text-slate-400">agent_core.exe --verbose</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="animate-pulse">●</span> PROCESSING
                </div>
            </div>

            {/* Terminal Content */}
            <div
                ref={scrollRef}
                className="p-4 h-64 overflow-y-auto space-y-2 bg-black/50"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-slate-600 text-xs mt-0.5 min-w-[60px]">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}
                        </span>
                        <div className="mt-0.5 flex-shrink-0">
                            {getIcon(log.type)}
                        </div>
                        <div className={`break-words ${log.type === 'success' ? 'text-green-400' :
                            log.type === 'tool' ? 'text-yellow-300' :
                                log.type === 'analysis' ? 'text-purple-300' :
                                    'text-slate-300'
                            }`}>
                            <span className="opacity-80 mr-2">{'>'}</span>
                            {log.message}
                        </div>
                    </div>
                ))}
                <div className="h-4" /> {/* Spacer */}
            </div>
        </div>
    );
};
