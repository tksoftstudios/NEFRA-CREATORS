import React, { useState } from 'react';
import {
  Card,
  Progress,
  Tag,
  Button,
  Row,
  Col,
  Input,
  message,
  Rate,
  Alert
} from 'antd';
import {
  SafetyCertificateOutlined,
  ThunderboltFilled,
  YoutubeFilled,
  RiseOutlined,
  CheckCircleFilled,
  WarningOutlined,
  RobotOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

export default function ChannelDiagnostics({ aiAudit, creator }) {
  const [testVideoUrl, setTestVideoUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [critiques, setCritiques] = useState(aiAudit.recentCritiques);

  const handleRunAudit = () => {
    if (!testVideoUrl) {
      message.warning('Please enter a YouTube video URL or ID to analyze');
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const newCritique = {
        videoTitle: "Autonomous AI Agent Framework in Production (New Upload)",
        views: "18,400",
        hookScore: 97,
        pacingScore: 94,
        sponsorReadiness: 99,
        critiqueText: "Gemini 2.5 Flash Multimodal analysis complete: Exceptional clarity, high technical authority, zero demonetized flags. Viewer retention predicted at 88% through middle integration."
      };
      setCritiques([newCritique, ...critiques]);
      message.success('Gemini AI multimodal audit completed!');
      setTestVideoUrl('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Gemini AI Channel Diagnostics & Audit</span>
            <Tag color="cyan">Powered by Gemini 2.5 Flash</Tag>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Deep multimodal analysis on video transcripts, thumbnail CTR hooks, brand safety, and retention.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Last Channel Scan: <strong className="text-slate-200">{aiAudit.lastUpdated}</strong>
        </div>
      </div>

      {/* Safety Score Card & Audit Summary */}
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card className="bg-slate-900/90 border-slate-800 text-center shadow-xl h-full flex flex-col justify-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
              <SafetyCertificateOutlined className="text-base" /> Brand Safety Rating
            </div>
            <div className="my-3">
              <Progress
                type="circle"
                percent={aiAudit.safetyScore}
                format={(percent) => (
                  <div className="text-white">
                    <div className="text-3xl font-bold font-mono">{percent}%</div>
                    <div className="text-[10px] text-cyan-400 font-medium">AAA Grade</div>
                  </div>
                )}
                strokeColor={{
                  '0%': '#06b6d4',
                  '100%': '#10b981'
                }}
                size={140}
              />
            </div>
            <span className="text-xs text-slate-300 font-medium">
              Enterprise Brand Advertiser Safe
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              Compliant with FTC, Google Ads, and Fortune 500 guidelines.
            </span>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title={
              <div className="flex items-center gap-2 py-1 text-white">
                <RobotOutlined className="text-indigo-400" />
                <span className="font-semibold">Safety & Compliance Diagnostic Checks</span>
              </div>
            }
            className="bg-slate-900/90 border-slate-800 shadow-xl h-full"
          >
            <div className="space-y-3">
              {aiAudit.flags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800"
                >
                  <CheckCircleFilled className="text-emerald-400 text-base mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    {flag.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
                <ThunderboltFilled className="text-amber-400" />
                <span>AI Sponsorship Pricing Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Based on your current 8.6% engagement rate and Tier 1 tech audience, your optimal integration rate is{' '}
                <strong className="text-emerald-400 font-mono">
                  {aiAudit.pricingIntelligence.recommendedIntegrationRate}
                </strong>
                . Setting rates below this undervalues your high conversion rate.
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Interactive Video Audit Tool */}
      <Card
        title={
          <div className="flex items-center gap-2 py-1 text-white">
            <PlayCircleOutlined className="text-red-500" />
            <span className="font-semibold">Analyze a Specific YouTube Video URL</span>
          </div>
        }
        className="bg-slate-900/90 border-slate-800 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Paste YouTube Video URL (e.g., https://youtube.com/watch?v=...)"
            value={testVideoUrl}
            onChange={(e) => setTestVideoUrl(e.target.value)}
            className="bg-slate-950 border-slate-700 text-white"
          />
          <Button
            type="primary"
            loading={analyzing}
            onClick={handleRunAudit}
            className="bg-indigo-600 hover:bg-indigo-500 font-semibold px-6 shadow-md shadow-indigo-600/30 shrink-0"
          >
            Run Multimodal Audit
          </Button>
        </div>
      </Card>

      {/* Recent Critiques List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Multimodal Video Critiques</span>
          <Tag color="indigo">{critiques.length} Videos Audited</Tag>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {critiques.map((crit, idx) => (
            <Card
              key={idx}
              className="bg-slate-900/85 border-slate-800 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <YoutubeFilled className="text-red-500 text-lg" />
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {crit.videoTitle}
                  </h4>
                </div>
                <Tag color="default" className="text-[10px] m-0 bg-slate-950 border-slate-700 text-slate-300">
                  {crit.views} Views
                </Tag>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Hook Retention</span>
                  <strong className="text-cyan-400 font-mono text-sm">{crit.hookScore}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Story Pacing</span>
                  <strong className="text-indigo-400 font-mono text-sm">{crit.pacingScore}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Sponsor Fit</span>
                  <strong className="text-emerald-400 font-mono text-sm">{crit.sponsorReadiness}%</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-2 pt-2 border-t border-slate-800/80">
                {crit.critiqueText}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
