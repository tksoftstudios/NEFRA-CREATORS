import React, { useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Space,
  Avatar,
  message,
  Divider,
  Alert
} from 'antd';
import {
  SendOutlined,
  LockOutlined,
  GlobalOutlined,
  CalendarOutlined,
  DollarOutlined,
  FilterOutlined,
  ThunderboltFilled,
  CheckCircleOutlined,
  CompassOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';

export default function JobOpportunities({ campaigns, creator }) {
  const [selectedModality, setSelectedModality] = useState('all');
  const [biddingCampaign, setBiddingCampaign] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidForm] = Form.useForm();

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    if (selectedModality === 'all') return true;
    return c.modality === selectedModality;
  });

  const handleOpenBidModal = (campaign) => {
    setBiddingCampaign(campaign);
    bidForm.resetFields();
    bidForm.setFieldsValue({
      proposedBudget: campaign.budget,
      turnaroundDays: 10,
      milestoneOutline: 30,
      milestoneDraft: 50,
      milestoneFinal: 20
    });
    setIsBidModalOpen(true);
  };

  const handleBidSubmit = (values) => {
    message.success(
      `Proposal submitted for "${biddingCampaign.title}"! Budget: $${values.proposedBudget}`
    );
    setIsBidModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Brand Opportunities & Job Market</span>
            <Tag color="green">Escrow Guaranteed</Tag>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Verified campaigns from software companies, AI startups, and hardware manufacturers.
          </p>
        </div>

        {/* Modality Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <FilterOutlined /> Modality:
          </span>
          {[
            { key: 'all', label: 'All Modalities' },
            { key: 'online', label: '🌐 Online (Remote)' },
            { key: 'hybrid', label: '📦 Hybrid (Hardware)' },
            { key: 'physical', label: '✈️ Physical (On-site)' }
          ].map(mod => (
            <button
              key={mod.key}
              onClick={() => setSelectedModality(mod.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedModality === mod.key
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => (
          <Card
            key={camp.id}
            className="bg-slate-900/85 border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Brand and Modality */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={camp.brandLogo}
                    shape="square"
                    size={46}
                    className="border border-slate-700 rounded-lg"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {camp.brandName}
                    </h3>
                    <span className="text-xs text-indigo-400 font-medium">
                      {camp.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Tag
                    color={
                      camp.modality === 'online'
                        ? 'blue'
                        : camp.modality === 'hybrid'
                        ? 'purple'
                        : 'green'
                    }
                    className="uppercase text-[10px] m-0 font-semibold"
                  >
                    {camp.modality}
                  </Tag>
                  {camp.escrowGuaranteed && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <LockOutlined /> Escrow Locked
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-base font-semibold text-slate-100 hover:text-indigo-300 transition-colors">
                {camp.title}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {camp.description}
              </p>

              {/* Geo / Whitelist Countries */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <GlobalOutlined className="text-indigo-400" /> Target Countries:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {camp.targetCountries.map((c, i) => (
                      <Tag key={i} color="default" className="text-[10px] m-0 bg-slate-900 border-slate-700 text-slate-300">
                        {c}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60">
                  <span className="text-slate-400">Deliverable Format:</span>
                  <strong className="text-slate-200">{camp.deliverableType}</strong>
                </div>
              </div>
            </div>

            {/* Budget & Action */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Campaign Budget:</span>
                <span className="text-xl font-bold text-white font-mono">
                  ${camp.budget.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {camp.bidsCount} proposals submitted
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => handleOpenBidModal(camp)}
                  className="bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Submit Proposal
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Bidding AntD Modal */}
      <Modal
        title={
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <SendOutlined className="text-indigo-400" />
            <span>Submit Custom Proposal / Bid</span>
          </div>
        }
        open={isBidModalOpen}
        onCancel={() => setIsBidModalOpen(false)}
        footer={null}
        destroyOnClose
        width={680}
        className="dark-modal"
      >
        {biddingCampaign && (
          <div className="mt-3 space-y-4">
            {/* Campaign Summary Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-indigo-400 font-semibold uppercase">
                  Applying to: {biddingCampaign.brandName}
                </span>
                <Tag color="cyan">{biddingCampaign.modality.toUpperCase()}</Tag>
              </div>
              <h4 className="text-sm font-bold text-white">
                {biddingCampaign.title}
              </h4>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                <span>
                  Budget: <strong className="text-emerald-400 font-mono">${biddingCampaign.budget.toLocaleString()}</strong>
                </span>
                <span>•</span>
                <span>Due Date: {biddingCampaign.deadline}</span>
              </div>
            </div>

            <Form
              form={bidForm}
              layout="vertical"
              onFinish={handleBidSubmit}
              className="space-y-3"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="proposedBudget"
                    label={<span className="text-slate-300">Your Custom Quote ($ USD)</span>}
                    rules={[{ required: true, message: 'Please enter your proposed budget' }]}
                    extra={<span className="text-[11px] text-slate-500">Includes 10% platform escrow guarantee fee</span>}
                  >
                    <InputNumber
                      min={500}
                      step={100}
                      className="w-full bg-slate-900 border-slate-700"
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="turnaroundDays"
                    label={<span className="text-slate-300">Estimated Delivery Time</span>}
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        { label: '5 Calendar Days (Rush)', value: 5 },
                        { label: '7 Calendar Days (Standard)', value: 7 },
                        { label: '10 Calendar Days', value: 10 },
                        { label: '14 Calendar Days (Comprehensive)', value: 14 }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="pitch"
                label={<span className="text-slate-300">Creator Angle & Cover Letter</span>}
                rules={[{ required: true, message: 'Please enter your pitch' }]}
                initialValue="Hi team, I run @KaveenTech (420K+ dev audience). I reviewed your product specifications and have the ideal technical benchmark scenario ready to film. Here is my proposed angle..."
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Explain why your audience matches this campaign, your creative angle, and hooks..."
                />
              </Form.Item>

              {/* Milestone Breakdown */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Escrow Payment Milestones
                </span>
                <Row gutter={12}>
                  <Col span={8}>
                    <div className="text-[11px] text-slate-400 mb-1">
                      Milestone 1: Script & Outline
                    </div>
                    <Form.Item name="milestoneOutline" noStyle>
                      <InputNumber min={10} max={50} addonAfter="%" className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div className="text-[11px] text-slate-400 mb-1">
                      Milestone 2: 4K Draft Video
                    </div>
                    <Form.Item name="milestoneDraft" noStyle>
                      <InputNumber min={30} max={70} addonAfter="%" className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div className="text-[11px] text-slate-400 mb-1">
                      Milestone 3: Live Post & Links
                    </div>
                    <Form.Item name="milestoneFinal" noStyle>
                      <InputNumber min={10} max={40} addonAfter="%" className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <Button onClick={() => setIsBidModalOpen(false)}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  className="bg-indigo-600 hover:bg-indigo-500 font-semibold"
                >
                  Submit Proposal to Brand
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
