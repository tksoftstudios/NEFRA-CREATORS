import React from 'react';
import { Card, Statistic, Tag, Button, Progress, Row, Col, Space, Tooltip, Avatar } from 'antd';
import {
  DollarCircleOutlined,
  LockOutlined,
  FileDoneOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  YoutubeFilled,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  RiseOutlined,
  RightOutlined
} from '@ant-design/icons';

export default function CreatorDashboard({
  creator,
  rateCards,
  escrowContracts,
  aiAudit,
  setActiveTab
}) {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar
                src={creator.avatar}
                size={76}
                className="border-2 border-indigo-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1 border-2 border-slate-900">
                <YoutubeFilled className="text-sm" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {creator.name}
                </h1>
                <CheckCircleFilled className="text-blue-400 text-base" />
                <Tag color="purple" className="border-purple-500/40 font-medium">
                  {creator.badge}
                </Tag>
                <Tag color="cyan" className="border-cyan-500/40">
                  {creator.residence}
                </Tag>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-xl line-clamp-2">
                {creator.bio}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <YoutubeFilled className="text-red-500" />
                  <strong className="text-slate-200">{creator.youtube.subscribers}</strong> Subscribers
                </span>
                <span>•</span>
                <span>
                  Avg. <strong className="text-slate-200">{creator.youtube.avgViews}</strong> views/video
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">
                  {creator.youtube.engagementRate} Engagement
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={() => setActiveTab('rate-card')}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 border-none font-semibold"
            >
              Manage Rate Card
            </Button>
            <Button
              size="large"
              onClick={() => setActiveTab('jobs')}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700"
            >
              Browse Brand Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Earned
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <DollarCircleOutlined className="text-lg" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white font-mono">
                ${creator.metrics.totalEarned.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400 font-medium">
                <ArrowUpOutlined />
                <span>+18.4% vs last month</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Escrow Protected
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <LockOutlined className="text-lg" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-indigo-300 font-mono">
                ${creator.metrics.escrowLocked.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                <span>{creator.metrics.activeContracts} active funded deliverables</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Proposal Win Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <RiseOutlined className="text-lg" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white font-mono">
                {creator.metrics.proposalWinRate}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                <span>{creator.metrics.completedDeals} brand contracts completed</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Gemini Safety Rating
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <SafetyCertificateOutlined className="text-lg" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-cyan-300 font-mono">
                  {aiAudit.safetyScore}%
                </span>
                <Tag color="cyan" className="text-[10px]">
                  AAA Grade
                </Tag>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-cyan-400">
                <span>Enterprise Brand Advertiser Certified</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Split: Active Escrow Jobs & AI Intelligence */}
      <Row gutter={[20, 20]}>
        {/* Left Column: Active Escrow Contracts */}
        <Col xs={24} lg={15}>
          <Card
            title={
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <LockOutlined className="text-indigo-400" />
                  <span className="text-white font-semibold">Active Escrow Deals</span>
                </div>
                <Button
                  type="link"
                  size="small"
                  onClick={() => setActiveTab('escrow')}
                  className="text-indigo-400 hover:text-indigo-300 p-0"
                >
                  View All ({escrowContracts.length}) <RightOutlined />
                </Button>
              </div>
            }
            className="bg-slate-900/80 border-slate-800 shadow-xl"
          >
            <div className="space-y-4">
              {escrowContracts.map(contract => (
                <div
                  key={contract.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100">
                          {contract.campaignTitle}
                        </span>
                        <Tag
                          color={contract.modality === 'online' ? 'blue' : 'green'}
                          className="uppercase text-[10px]"
                        >
                          {contract.modality}
                        </Tag>
                      </div>
                      <span className="text-xs text-indigo-400 font-medium">
                        Brand: {contract.brand} • {contract.packageType}
                      </span>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        ${contract.amount.toLocaleString()} in Escrow
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Net Payout: ${contract.netPayout.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Stage: <strong className="text-slate-200">{contract.steps[contract.currentStep]?.title}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <ClockCircleOutlined /> Due {contract.deadline}
                      </span>
                    </div>
                    <Progress
                      percent={((contract.currentStep + 1) / contract.steps.length) * 100}
                      showInfo={false}
                      strokeColor={{
                        '0%': '#6366f1',
                        '100%': '#10b981'
                      }}
                      size={['100%', 6]}
                    />
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {contract.steps[contract.currentStep]?.desc}
                    </span>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => setActiveTab('escrow')}
                      className="bg-indigo-600 text-xs hover:bg-indigo-500"
                    >
                      Open Milestone Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Column: Rate Card Snapshot & AI Guidance */}
        <Col xs={24} lg={9}>
          <div className="space-y-6">
            {/* Rate Card Quick Widget */}
            <Card
              title={
                <div className="flex items-center justify-between py-1">
                  <span className="text-white font-semibold">Configured Rate Cards</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setActiveTab('rate-card')}
                    className="text-indigo-400 p-0"
                  >
                    Edit Rates
                  </Button>
                </div>
              }
              className="bg-slate-900/80 border-slate-800 shadow-xl"
            >
              <div className="space-y-3">
                {rateCards.map(rc => (
                  <div
                    key={rc.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {rc.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {rc.turnaroundDays}d delivery • {rc.revisions} rev
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white font-mono">
                        ${rc.price.toLocaleString()}
                      </div>
                      <Tag color="cyan" className="m-0 text-[10px]">
                        {rc.badge}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Channel Pricing Advice */}
            <Card
              title={
                <div className="flex items-center gap-2 py-1">
                  <ThunderboltOutlined className="text-amber-400" />
                  <span className="text-white font-semibold">Gemini Pricing Intelligence</span>
                </div>
              }
              className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border-slate-800 shadow-xl"
            >
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                  <div className="font-semibold mb-1">🔥 High Market Demand</div>
                  <span>{aiAudit.pricingIntelligence.marketDemand}</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Optimal Dedicated Video:</span>
                    <strong className="text-emerald-400 font-mono">
                      {aiAudit.pricingIntelligence.recommendedDedicatedRate}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-400">Optimal Integration:</span>
                    <strong className="text-indigo-400 font-mono">
                      {aiAudit.pricingIntelligence.recommendedIntegrationRate}
                    </strong>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">Optimal Shorts:</span>
                    <strong className="text-cyan-400 font-mono">
                      {aiAudit.pricingIntelligence.recommendedShortsRate}
                    </strong>
                  </div>
                </div>

                <Button
                  block
                  onClick={() => setActiveTab('ai-audit')}
                  className="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 text-xs"
                >
                  Run Deep Video Diagnostic
                </Button>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
