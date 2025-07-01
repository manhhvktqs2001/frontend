import React, { useState, useEffect, useRef } from 'react';
import { 
  SparklesIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
  CpuChipIcon,
  LightBulbIcon,
  BugAntIcon,
  MagnifyingGlassIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI Security Assistant. I can help you analyze threats, investigate incidents, and provide security recommendations. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze current threat landscape",
        "Investigate recent alerts",
        "Generate security report",
        "Recommend security improvements"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const responses = {
      threat: {
        content: "Based on current threat intelligence, I've detected 3 critical indicators requiring immediate attention:\n\n🔴 **Suspicious PowerShell Activity**: Encoded commands detected on 5 endpoints\n🟠 **Unusual Network Traffic**: C2 communication patterns identified\n🟡 **File Integrity Violations**: 12 system files modified unexpectedly\n\nRecommended actions:\n1. Isolate affected endpoints\n2. Analyze PowerShell logs\n3. Block suspicious IPs\n4. Run full system scans",
        suggestions: ["Show affected endpoints", "Generate incident report", "Block malicious IPs"]
      },
      alert: {
        content: "Alert Analysis Summary:\n\n📊 **Last 24 Hours**: 47 alerts generated\n🔴 **Critical**: 3 alerts (Ransomware detection)\n🟠 **High**: 8 alerts (Malware signatures)\n🟡 **Medium**: 23 alerts (Suspicious behavior)\n🟢 **Low**: 13 alerts (Policy violations)\n\n**Top Alert Sources**:\n- WIN-SRV-01: 12 alerts\n- WIN-WS-034: 8 alerts\n- LIN-DB-02: 6 alerts\n\nAll critical alerts have been auto-escalated to SOC team.",
        suggestions: ["View critical alerts", "Export alert report", "Tune alert rules"]
      },
      report: {
        content: "Security Report Generated 📋\n\n**Executive Summary**:\n- Security Score: 87/100 (+5 from last week)\n- Incidents Resolved: 23 (98% within SLA)\n- Mean Time to Detection: 4.2 minutes\n- Mean Time to Response: 12.8 minutes\n\n**Key Metrics**:\n✅ 99.7% endpoint protection coverage\n✅ Zero successful breaches\n⚠️ 3 policy compliance gaps identified\n⚠️ 2 outdated security controls\n\nFull report has been saved to your dashboard.",
        suggestions: ["Download PDF report", "Schedule recurring reports", "View detailed metrics"]
      },
      improve: {
        content: "Security Improvement Recommendations 🚀\n\n**High Priority**:\n1. **Enable Zero Trust Architecture** - Reduce attack surface by 40%\n2. **Implement UEBA** - Detect insider threats and compromised accounts\n3. **Deploy Deception Technology** - Early threat detection\n\n**Medium Priority**:\n4. **Enhance Email Security** - Add advanced anti-phishing\n5. **Strengthen Identity Management** - MFA for all privileged accounts\n6. **Improve Backup Strategy** - Immutable backup solutions\n\n**ROI Impact**: Estimated 60% reduction in security incidents",
        suggestions: ["Create implementation plan", "Calculate ROI", "Schedule security assessment"]
      }
    };

    const input = userInput.toLowerCase();
    if (input.includes('threat') || input.includes('malware') || input.includes('attack')) {
      return { ...responses.threat, id: Date.now(), type: 'assistant', timestamp: new Date() };
    } else if (input.includes('alert') || input.includes('incident')) {
      return { ...responses.alert, id: Date.now(), type: 'assistant', timestamp: new Date() };
    } else if (input.includes('report') || input.includes('summary')) {
      return { ...responses.report, id: Date.now(), type: 'assistant', timestamp: new Date() };
    } else if (input.includes('improve') || input.includes('recommend')) {
      return { ...responses.improve, id: Date.now(), type: 'assistant', timestamp: new Date() };
    }

    return {
      id: Date.now(),
      type: 'assistant',
      content: `I understand you're asking about: "${userInput}"\n\nI can help you with:\n• Threat analysis and investigation\n• Security incident response\n• Performance monitoring\n• Compliance reporting\n• Risk assessment\n\nCould you provide more specific details about what you'd like me to analyze?`,
      timestamp: new Date(),
      suggestions: ["Analyze current threats", "Show system status", "Generate compliance report"]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput("What are the current security threats?");
      }, 2000);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { icon: BugAntIcon, label: 'Threat Hunt', action: () => setInput('Analyze current threats') },
    { icon: ExclamationTriangleIcon, label: 'Alert Review', action: () => setInput('Review recent alerts') },
    { icon: ChartBarIcon, label: 'Security Report', action: () => setInput('Generate security report') },
    { icon: ShieldCheckIcon, label: 'Risk Assessment', action: () => setInput('Assess security risks') },
    { icon: MagnifyingGlassIcon, label: 'Investigate', action: () => setInput('Help me investigate an incident') },
    { icon: LightBulbIcon, label: 'Recommendations', action: () => setInput('Recommend security improvements') }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Security Assistant</h1>
            <p className="text-gray-400 text-sm">Powered by advanced machine learning</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-white font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 hover:border-white/20"
            >
              <action.icon className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-300">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600' : 'bg-white/10'} rounded-2xl p-4 ${message.type === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
              <div className="flex items-start gap-3">
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">
                      {message.type === 'assistant' ? 'AI Assistant' : 'You'}
                    </span>
                    <span className="text-gray-400 text-xs">{formatTimestamp(message.timestamp)}</span>
                  </div>
                  <div className="text-white whitespace-pre-line text-sm leading-relaxed">
                    {message.content}
                  </div>
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-gray-300 transition-colors border border-white/20"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-3xl bg-white/10 rounded-2xl rounded-bl-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about threats, alerts, reports, or security recommendations..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
            <button
              onClick={handleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                isListening ? 'text-red-400 bg-red-500/20' : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          AI Assistant can analyze threats, investigate incidents, and provide security recommendations
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 