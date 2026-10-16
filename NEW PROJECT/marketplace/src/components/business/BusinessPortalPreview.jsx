import React, { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Modal,
  Alert,
  message
} from 'antd';
import {
  RocketOutlined,
  PlusOutlined,
  GlobalOutlined,
  LockOutlined,
  SwapOutlined,
  SearchOutlined
} from '@ant-design/icons';
import CreatorDirectory from '../creator/CreatorDirectory';

export default function BusinessPortalPreview({
  onSwitchToCreator,
  campaigns,
  setCampaigns
}) {
  const [isNewCampModalOpen, setIsNewCampModalOpen] = useState(false);
  const [campForm] = Form.useForm();

  const handleCreateCampaign = (values) => {
    const newCamp = {
      id: `camp_${Date.now()}`,
      brandName: "Acme Enterprise Corp",
      brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
      title: values.title,
      category: values.category,
      modality: values.modality,
      budget: values.budget,
      escrowGuaranteed: true,
      deadline: values.deadline || "2026-11-20",
      targetCountries: values.targetCountries || ["Global"],
      description: values.description,
      deliverableType: values.deliverableType,
      bidsCount: 0
    };

    setCampaigns([newCamp, ...campaigns]);
    message.success('Campaign created and escrow deposit initialized!');
    setIsNewCampModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Brand Mode Alert / Switcher Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <RocketOutlined className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Brand & Enterprise Client Workspace
              </h2>
              <Tag color="green">Buyer Mode Active</Tag>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Hire verified creators, configure escrow contracts, and launch targeted video campaigns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsNewCampModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 border-none font-semibold shadow-md shadow-emerald-600/30"
          >
            Post Brand Campaign
          </Button>

          <Button
            icon={<SwapOutlined />}
            onClick={onSwitchToCreator}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
          >
            Switch to Creator (Selling)
          </Button>
        </div>
      </div>

      {/* Directory of Creators for Brands */}
      <CreatorDirectory />

      {/* Post Campaign Modal */}
      <Modal
        title={
          <span className="text-white font-bold text-lg">
            Post New Brand Campaign (with Escrow)
          </span>
        }
        open={isNewCampModalOpen}
        onCancel={() => setIsNewCampModalOpen(false)}
        footer={null}
        destroyOnClose
        className="dark-modal"
      >
        <Form
          form={campForm}
          layout="vertical"
          onFinish={handleCreateCampaign}
          className="mt-3 space-y-3"
        >
          <Form.Item
            name="title"
            label={<span className="text-slate-300">Campaign Title</span>}
            rules={[{ required: true, message: 'Please enter campaign title' }]}
          >
            <Input
              placeholder="e.g. Next-Gen Developer Agent Showcase"
              className="bg-slate-900 border-slate-700 text-white"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label={<span className="text-slate-300">Category</span>}
                rules={[{ required: true }]}
                initialValue="Developer Tools & AI"
              >
                <Select
                  options={[
                    { label: 'Developer Tools & AI', value: 'Developer Tools & AI' },
                    { label: 'Consumer Tech & Hardware', value: 'Consumer Tech & Hardware' },
                    { label: 'Cloud & Infrastructure', value: 'Cloud & Infrastructure' },
                    { label: 'Gaming & High Performance', value: 'Gaming & High Performance' }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="modality"
                label={<span className="text-slate-300">Modality</span>}
                rules={[{ required: true }]}
                initialValue="online"
              >
                <Select
                  options={[
                    { label: '🌐 Online (Remote video)', value: 'online' },
                    { label: '📦 Hybrid (Shipped hardware)', value: 'hybrid' },
                    { label: '✈️ Physical (On-site event / shoot)', value: 'physical' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label={<span className="text-slate-300">Campaign Escrow Budget (USD)</span>}
                rules={[{ required: true }]}
                initialValue={5000}
              >
                <InputNumber
                  min={500}
                  step={250}
                  className="w-full bg-slate-900 border-slate-700"
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="deliverableType"
                label={<span className="text-slate-300">Deliverable Format</span>}
                rules={[{ required: true }]}
                initialValue="Dedicated Full Video"
              >
                <Select
                  options={[
                    { label: 'Dedicated Full Video (8-15 min)', value: 'Dedicated Full Video' },
                    { label: '60-90s Sponsored Integration', value: 'Sponsored Integration' },
                    { label: 'YouTube Shorts (Vertical)', value: 'YouTube Shorts' },
                    { label: 'Custom Multi-asset Package', value: 'Custom Multi-asset' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="targetCountries"
            label={<span className="text-slate-300">Target Creator Geographic Whitelist</span>}
            initialValue={["US", "Europe", "Singapore"]}
          >
            <Select
              mode="tags"
              placeholder="Add accepted countries (e.g., US, UK, Japan, Singapore)"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-slate-300">Campaign Scope & Goals</span>}
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Outline what product you are shipping or access you are providing, and key talking points..."
            />
          </Form.Item>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <Button onClick={() => setIsNewCampModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-emerald-600 hover:bg-emerald-500 font-semibold"
            >
              Deposit Escrow & Publish
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
